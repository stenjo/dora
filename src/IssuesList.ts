/* eslint-disable @typescript-eslint/no-explicit-any */
import { Octokit } from '@octokit/core';
import * as core from '@actions/core';

export class IssuesList {
  
  async issueList(token: string|undefined, owner: string, repo: string): Promise<any> {
    const today = new Date();
    const since = new Date(today.valueOf() - (61*24*60*60*1000))  // Go two months back
    try {
      const octokit = new Octokit({
        auth: token
      });
  
      const result = await octokit.request('GET /repos/{owner}/{repo}/issues?state=all&since={since}', {
        owner,
        repo,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        },
        since: since.toISOString(),

      });
  
      return Promise.resolve(result.data);
  
    } catch (e: any) {
      core.setFailed(e.message);
    }
  }
  
}
