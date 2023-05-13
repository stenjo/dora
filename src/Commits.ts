/* eslint-disable @typescript-eslint/no-explicit-any */
import {Octokit} from '@octokit/core'
import * as core from '@actions/core'

export class Commits {
  token: string | undefined
  owner: string
  repo: string
  constructor(token: string | undefined, owner: string, repo: string) {
    this.token = token
    this.owner = owner
    this.repo = repo
  }
  async getCommitsByPullNumber(pullNumber: number): Promise<any> {
    try {
      const octokit = new Octokit({
        auth: this.token
      })

      const result = await octokit.request(
        'GET /repos/{owner}/{repo}/pulls/{pull}/commits',
        {
          owner: this.owner,
          repo: this.repo,
          pull: pullNumber,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        }
      )

      return Promise.resolve(result.data)
    } catch (e: any) {
      core.setFailed(e.message)
    }
  }
}
