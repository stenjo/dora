/* eslint-disable @typescript-eslint/no-explicit-any */
import { Octokit } from '@octokit/core';
import * as core from '@actions/core';
import { IIssuesList } from './IIssuesList';

export class IssuesList implements IIssuesList {
  token: string | undefined;
  owner: string;
  repo: string;

  constructor (token: string|undefined, owner: string, repo: string) {
    this.token = token;
    this.owner = owner;
    this.repo = repo;
  }
  
  async issueList(): Promise<any> {
    const today = new Date();
    const since = new Date(today.valueOf() - (61*24*60*60*1000))  // Go two months back
    try {
      const octokit = new Octokit({
        auth: this.token
      });
  
      const result = await octokit.request('GET /repos/{owner}/{repo}/issues?state=all&since={since}&per_page={per_page}&page={page}', {
        owner: this.owner,
        repo: this.repo,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        },
        since: since.toISOString(),
        per_page: 5,
        page: 1,

      });
  
      return Promise.resolve(result.data);
  
    } catch (e: any) {
      core.setFailed(e.message);
    }
  }
  
}
