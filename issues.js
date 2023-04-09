// Issues.js
import { Octokit, App } from "octokit";

const octokit = new Octokit({
    auth: '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'
  });

const {
  data: { login },
} = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
    owner: 'stenjo',
    repo: 'SbankenToYNAB',
    headers: {
        'X-GitHub-Api-Version': '2022-11-28'
    }
});

module.exports=issues;