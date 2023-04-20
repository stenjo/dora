var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as core from '@actions/core';
// import { wait } from './wait';
import * as github from '@actions/github';
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // const ms: string = core.getInput('milliseconds');
            // core.info(`Waiting ${ms} milliseconds ...`);
            // core.debug(new Date().toTimeString()); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
            // await wait(parseInt(ms));
            // core.info(new Date().toTimeString());
            var repo = core.getInput('repo');
            // core.info(github.context.repository)
            if (repo == '' || repo == null) {
                repo = github.context.repo.repo;
            }
            core.info(`${repo}`);
            // core.setOutput('time', new Date().toTimeString());
            // const payload: string = JSON.stringify(github.context.payload, undefined, 2);
            // console.log(`The event payload: ${payload}`);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
//# sourceMappingURL=index.js.map