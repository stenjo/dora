import {Commits} from '../src/Commits'

test.skip('fetches tags', async () => {
  const cmts = new Commits(process.env['GH_TOKEN'], 'stenjo', 'dora')
  const cl = await cmts.getCommitsByPullNumber(10)

  expect(cl.length).toBeGreaterThan(-1)
  expect(cl.length).toBe(15)
})
