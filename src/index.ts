/* eslint-disable @typescript-eslint/no-explicit-any */
import * as core from '@actions/core';
import * as github from '@actions/github';
import { Releases } from './Releases';
import { DeployFrequency } from './DeployFrequency';
import { ChangeFailureRate } from './ChangeFailureRate';
import { IssueObject } from './IIssue';
import { IssuesList } from './IssuesList';
import { MeanTimeToRestore } from './MeanTimeToRestore';


async function run(): Promise<void> {
  try {
   
    let repo: string = core.getInput('repo');
    if (repo == '' || repo == null) {
      repo = github.context.repo.repo
    }

    let owner: string = core.getInput('owner');
    if (owner == '' || owner == null) {
      owner = github.context.repo.owner
    }

    let token: string | undefined = core.getInput('token');
    if (token == '' || token == null) {
      // token = github.context.token;
      token = process.env['GH_TOKEN']
    }

    core.info(`${owner}-${repo}`);

    const rel = new Releases();
    const releaselist =  await rel.list(token, owner, repo);
    const df = new DeployFrequency(releaselist);
    core.setOutput('deploy-rate', df.rate());

    const iss = new IssuesList();
    const issuelist: IssueObject[] = await iss.issueList(token, owner, repo);
    const cfr = new ChangeFailureRate(issuelist);
    core.setOutput('change-failure-rate', cfr.getCfrPercentage(df.monthly()));

    const mttr = new MeanTimeToRestore(issuelist, releaselist);
    core.setOutput('mttr', mttr.mttr());

  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
