/* eslint-disable @typescript-eslint/no-explicit-any */
import * as core from '@actions/core';
import * as github from '@actions/github';
import { Releases } from './Releases';
import { DeployFrequency } from './DeployFrequency';


async function run(): Promise<void> {
  try {
    // const ms: string = core.getInput('milliseconds');
    // core.info(`Waiting ${ms} milliseconds ...`);

    // core.debug(new Date().toTimeString()); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    // await wait(parseInt(ms));
    // core.info(new Date().toTimeString());
    let repo: string = core.getInput('repo');
    if (repo == '' || repo == null) {
      repo = github.context.repo.repo
    }

    let owner: string = core.getInput('owner');
    if (owner == '' || owner == null) {
      owner = github.context.repo.owner
    }

    core.info(`${owner}-${repo}`);

    const rel = new Releases();
    const releaselist =  await rel.list(process.env['GH_TOKEN'], owner, repo);
    const df = new DeployFrequency(releaselist);
    core.setOutput('deploy_rate', df.rate());

  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
