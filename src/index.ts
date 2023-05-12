/* eslint-disable @typescript-eslint/no-explicit-any */
import * as core from "@actions/core";
import * as github from "@actions/github";
import { ReleaseAdapter } from "./ReleaseAdapter";
import { DeployFrequency } from "./DeployFrequency";
import { ChangeFailureRate } from "./ChangeFailureRate";
import { IssueObject } from "./interfaces/IIssue";
import { IssuesAdapter } from "./IssuesAdapter";
import { MeanTimeToRestore } from "./MeanTimeToRestore";
import { PullRequestsAdapter } from "./PullRequestsAdapter";
import { LeadTime } from "./LeadTime";
import { Commits } from "./Commits";
import { ReleaseObject } from "./interfaces/IRelease";
import { PullRequestObject } from "./IPullRequestObject";

async function run(): Promise<void> {
  try {
    let repo: string = core.getInput("repo");
    if (repo == "" || repo == null) {
      repo = github.context.repo.repo;
    }
    // Allow for multiple repos, ex: [val1, val2, val3]
    const repos = repo
      .split(/[[\]\n,]+/)
      .map((s) => s.trim())
      .filter((x) => x !== "");

    core.info(repos.length + " repositor(y|ies) registered.")

    let owner: string = core.getInput("owner");
    if (owner == "" || owner == null) {
      owner = github.context.repo.owner;
    }

    let token: string | undefined = core.getInput("token");
    if (token == "" || token == null) {
      // token = github.context.token;
      token = process.env["GH_TOKEN"];
    }

    core.info(`${owner}-${repos}`);

    const rel = new ReleaseAdapter(token, owner, repo);
    const releaselist =
      (await rel.GetAllReleasesLastMonth()) as ReleaseObject[];
    const df = new DeployFrequency(releaselist);
    core.setOutput("deploy-rate", df.rate());

    const prs = new PullRequestsAdapter(token, owner, repo);
    const pulls = (await prs.GetAllPRsLastMonth()) as PullRequestObject[];
    const lt = new LeadTime(pulls, releaselist, async (pullNumber: number) => {
      const cmts = new Commits(token, owner, repo);
      return await cmts.getCommitsByPullNumber(pullNumber);
    });
    const leadTime = await lt.getLeadTime();
    core.setOutput("lead-time", leadTime);

    const issueAdapter = new IssuesAdapter(token, owner, repo);
    const issuelist: IssueObject[] | undefined =
      await issueAdapter.GetAllIssuesLastMonth();
    if (issuelist) {
      const cfr = new ChangeFailureRate(issuelist, releaselist);
      core.setOutput("change-failure-rate", cfr.Cfr());
      const mttr = new MeanTimeToRestore(issuelist, releaselist);
      core.setOutput("mttr", mttr.mttr());
    } else {
      core.setOutput("change-failure-rate", "empty issue list");
      core.setOutput("mttr", "empty issue list");
    }
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
