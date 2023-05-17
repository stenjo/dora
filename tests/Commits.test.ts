import {Commits} from '../src/Commits'
import {CommitsAdapter} from '../src/CommitsAdapter'
import {Commit} from '../src/interfaces/Commit'
import * as dotenv from 'dotenv'

dotenv.config()


test.skip('fetches tags', async () => {
  const cmts = new Commits(process.env['GH_TOKEN'], 'stenjo', 'dora')
  const cl = await cmts.getCommitsByPullNumber(10)

  expect(cl.length).toBeGreaterThan(-1)
  expect(cl.length).toBe(15)
})

test.skip('CommitsAdapter should', async () => {
  const ca = new CommitsAdapter(process.env['GH_TOKEN'])

  const result = await ca.getCommitsFromUrl(
    'https://api.github.com/repos/stenjo/devops-metrics-action/pulls/69/commits'
  )

  expect(result).not.toBe(undefined)
  expect((result as Commit[]).length).toBeGreaterThan(7)
})
