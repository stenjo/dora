import {PullRequest} from '../src/interfaces/PullRequest'
import {PullRequestsAdapter} from '../src/PullRequestsAdapter'

const ONE_DAY = 24 * 60 * 60 * 1000

test.skip('fetches tags', async () => {
  const prs = new PullRequestsAdapter(process.env['GH_TOKEN'], 'stenjo', [
    'dora'
  ])
  const prlist = await prs.GetAllPRsLastMonth()

  expect(prlist).toBeDefined()
  expect((prlist as PullRequest[]).length).toBeGreaterThan(-1)
  expect(
    (prlist as PullRequest[]).filter(
      p => +new Date(p.merged_at) > Date.now() - 7 * ONE_DAY
    ).length
  ).toBe(8)
})
