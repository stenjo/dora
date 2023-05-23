import {ReleaseAdapter} from '../src/ReleaseAdapter'
import {Release} from '../src/types/Release'
import fs from 'fs'

describe('Mocked Release API should', () => {
  it('return releases', async () => {
    const r = new ReleaseAdapter(process.env['GH_TOKEN'], 'stenjo', ['dora'])
    mockedGetReleasesReturns('./tests/test-data/releases.json')

    const tl: Array<Release> =
      (await r.GetAllReleasesLastMonth()) as Array<Release>

    expect(tl.length).toBeGreaterThan(0)
    expect(tl[0].author.type).toBe('Bot')
    expect(tl.reverse()[0].name).toBe('v0.0.1')
  })
})

function mockedGetReleasesReturns(file: string) {
  const getIssuesMock = jest.spyOn(
    ReleaseAdapter.prototype as any,
    'getReleases'
  )
  getIssuesMock.mockImplementation((): Promise<Release[]> => {
    return Promise.resolve(
      JSON.parse(fs.readFileSync(file).toString()) as Release[]
    )
  })
}
