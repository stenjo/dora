import { Octokit } from '@octokit/core';
import * as core from '@actions/core';

export class Releases {

  async list(token : string | undefined, owner:string, repo: string): Promise<any> {
    const octokit = new Octokit({
      auth: token
    });
  
    try {

      var result = await octokit.request('GET /repos/{owner}/{repo}/releases', {
        owner: owner,
        repo: repo,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
      });

      return Promise.resolve(result.data);

    } catch (e:any) {
      core.setFailed(e.message);
    }
  }
}
