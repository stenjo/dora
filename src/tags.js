// Issues.js
const ok = require('@octokit/core');
const core = require('@actions/core');

async function tags(token, owner, repo) {
  try {
    const octokit = new ok.Octokit({
      auth: token
    });

    var result = await octokit.request('GET /repos/{owner}/{repo}/tags', {
      owner: owner,
      repo: repo,
      headers: {
          'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    return Promise.resolve(result.data);

  } catch (e) {
    core.setFailed(e.message);
  }
}

module.exports=tags;