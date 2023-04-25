/* eslint-disable @typescript-eslint/no-explicit-any */
import { Octokit } from '@octokit/core';
import * as core from '@actions/core';

export class Issues {
  
  async issueList(token: string|undefined, owner: string, repo: string): Promise<any> {
    try {
      const octokit = new Octokit({
        auth: token
      });
  
      const result = await octokit.request('GET /repos/{owner}/{repo}/issues', {
        owner,
        repo,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
      });
  
      return Promise.resolve(result.data);
  
    } catch (e: any) {
      core.setFailed(e.message);
    }
  }
  
}
