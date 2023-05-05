/* eslint-disable @typescript-eslint/no-explicit-any */
import { Octokit } from "@octokit/core";
import * as core from "@actions/core";

export class PullRequests {
  token: string | undefined;
  repo: string;
  owner: string;

  constructor(token: string | undefined, owner: string, repo: string) {
    this.token = token;
    this.owner = owner;
    this.repo = repo;
  }

  async list(): Promise<any> {
    const octokit = new Octokit({
      auth: this.token,
    });

    try {
      const result = await octokit.request(
        "GET /repos/{owner}/{repo}/pulls?state=closed",
        {
          owner: this.owner,
          repo: this.repo,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );

      return Promise.resolve(result.data);
    } catch (e: any) {
      core.setFailed(e.message);
    }
  }
}
