/* eslint-disable @typescript-eslint/no-explicit-any */
import * as core from "@actions/core";
import * as github from "@actions/github";
import { Releases } from "./Releases";
import { DeployFrequency } from "./DeployFrequency";
import { ChangeFailureRate } from "./ChangeFailureRate";
import { IssueObject } from "./IIssue";
import { IssuesList } from "./IssuesList";
import { MeanTimeToRestore } from "./MeanTimeToRestore";
import { PullRequests } from "./PullRequests";
import { LeadTime } from "./LeadTime";
import { Commits } from "./Commits";

async function run(): Promise<void> {
  try {
    let repo: string = core.getInput("repo");
    if (repo == "" || repo == null) {
      repo = github.context.repo.repo;
    }

    let owner: string = core.getInput("owner");
    if (owner == "" || owner == null) {
      owner = github.context.repo.owner;
    }

    let token: string | undefined = core.getInput("token");
    if (token == "" || token == null) {
      // token = github.context.token;
      token = process.env["GH_TOKEN"];
    }

    core.info(`${owner}-${repo}`);

    const rel = new Releases();
    const releaselist = await rel.list(token, owner, repo);
    const df = new DeployFrequency(releaselist);
    core.setOutput("deploy-rate", df.rate());

    const prs = new PullRequests(token, owner, repo);
    const pulls = await prs.list();
    const lt = new LeadTime(pulls, releaselist, async (pullNumber: number) => {
      const cmts = new Commits(token, owner, repo);
      return await cmts.getCommitsByPullNumber(pullNumber);
    });
    const leadTime = await lt.getLeadTime();
    core.setOutput("lead-time", leadTime);

    const issueAdapter = new IssuesList(token, owner, repo);
    const issuelist: IssueObject[] | undefined = await issueAdapter.GetAllIssuesLastMonth();
    if (issuelist) {
      const cfr = new ChangeFailureRate(issuelist, releaselist);
      core.setOutput("change-failure-rate", cfr.Cfr());
      const mttr = new MeanTimeToRestore(issuelist, releaselist);
      core.setOutput("mttr", mttr.mttr());
      }
    else {
      core.setOutput("change-failure-rate", "empty issue list");
      core.setOutput("mttr", "empty issue list");
    }

  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
