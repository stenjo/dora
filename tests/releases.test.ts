import {ReleaseAdapter} from '../src/ReleaseAdapter'
import {Release} from '../src/types/Release'
import fs from 'fs'

test('fetches releases', async () => {
  const r = new ReleaseAdapter(process.env['GH_TOKEN'], 'stenjo', ['dora'])
  const getReleasesMock = jest.spyOn(
    ReleaseAdapter.prototype as any,
    'getReleases'
  )
  getReleasesMock.mockImplementation((): Promise<Release[]> => {
    return Promise.resolve(
      JSON.parse(
        fs.readFileSync('./tests/test-data/releases.json').toString()
      ) as Release[]
    )
  })
  const tl: Array<Release> =
    (await r.GetAllReleasesLastMonth()) as Array<Release>

  expect(tl.length).toBeGreaterThan(0)
  expect(tl[0].author.type).toBe('Bot')
  expect(tl.reverse()[0].name).toBe('v0.0.1')
})
