import * as core from '@actions/core';
import { wait } from './wait';
import * as github from '@actions/github';

async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds');
    core.info(`Waiting ${ms} milliseconds ...`);

    core.debug(new Date().toTimeString()); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    await wait(parseInt(ms));
    core.info(new Date().toTimeString());

    core.setOutput('time', new Date().toTimeString());

    const payload: string = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
