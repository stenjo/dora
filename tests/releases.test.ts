import {ReleaseAdapter} from '../src/ReleaseAdapter'
import {Release} from '../src/types/Release'

test.skip('fetches releases', async () => {
  const r = new ReleaseAdapter(process.env['GH_TOKEN'], 'stenjo', ['dora'])
  const tl: Array<Release> =
    (await r.GetAllReleasesLastMonth()) as Array<Release>

  expect(tl.length).toBeGreaterThan(0)
  expect(tl[0].author.type).toBe('Bot')
  expect(tl.reverse()[0].name).toBe('v0.0.1')
})
