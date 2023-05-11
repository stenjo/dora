/* eslint-disable @typescript-eslint/no-explicit-any */
import { Octokit } from '@octokit/core';
import * as core from '@actions/core';
import { IIssuesList } from './IIssuesList';
import { IssueObject } from './IIssue';

export class IssuesList implements IIssuesList {
  token: string | undefined;
  owner: string;
  repo: string;
  pageNo: number;

  constructor (token: string|undefined, owner: string, repo: string) {
    this.token = token;
    this.owner = owner;
    this.repo = repo;
    this.pageNo = 1;
  }
  
  async GetAllIssuesLastMonth() {
    const today = new Date();
    const since = new Date(today.valueOf() - (61*24*60*60*1000))  // Go two months back
    try {
      const octokit = new Octokit({
        auth: this.token
      });
  

      let result = await this.GetIssues(octokit, since, 1);
      let nextPage = result;
      for (let page = 2; page < 100 && nextPage.length > 0; page++) {
        nextPage = await this.GetIssues(octokit, since, page);
        result = result.concat(nextPage);
      }
 
      return result;
  
    } catch (e: any) {
      core.setFailed(e.message);
    }
  }
  

  private async GetIssues(octokit: Octokit, since: Date, page: number): Promise<IssueObject[]> {
    const result = await octokit.request('GET /repos/{owner}/{repo}/issues?state=all&since={since}&per_page={per_page}&page={page}', {
      owner: this.owner,
      repo: this.repo,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      },
      since: since.toISOString(),
      per_page: 100,
      page: page,
    });

    return Promise.resolve(result.data) as Promise<IssueObject[]>;
  }
}
