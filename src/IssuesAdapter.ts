/* eslint-disable @typescript-eslint/no-explicit-any */
import { Octokit } from "@octokit/core";
import * as core from "@actions/core";
import { IIssuesAdapter } from "./interfaces/IIssuesAdapter";
import { IssueObject } from "./interfaces/IIssue";

export class IssuesAdapter implements IIssuesAdapter {
  token: string | undefined;
  owner: string;
  repo: string;
  today: Date;

  constructor(token: string | undefined, owner: string, repo: string) {
    this.token = token;
    this.owner = owner;
    this.repo = repo;
    this.today = new Date();
  }

  async GetAllIssuesLastMonth() {
    const since = new Date(this.today.valueOf() - 61 * 24 * 60 * 60 * 1000); // Go two months back
    try {
      const octokit = new Octokit({
        auth: this.token,
      });

      let result = await this.getIssues(octokit, since, 1);
      let nextPage = result;
      for (let page = 2; page < 100 && nextPage.length === 100; page++) {
        nextPage = await this.getIssues(octokit, since, page);
        result = result.concat(nextPage);
      }

      return result;
    } catch (e: any) {
      core.setFailed(e.message);
    }
  }

  private async getIssues(
    octokit: Octokit,
    since: Date,
    page: number
  ): Promise<IssueObject[]> {
    const result = await octokit.request(
      "GET /repos/{owner}/{repo}/issues?state=all&since={since}&per_page={per_page}&page={page}",
      {
        owner: this.owner,
        repo: this.repo,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
        since: since.toISOString(),
        per_page: 100,
        page: page,
      }
    );

    return Promise.resolve(result.data) as Promise<IssueObject[]>;
  }
}
