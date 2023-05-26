import {ReleaseAdapter} from '../src/ReleaseAdapter'
import {Release} from '../src/types/Release'
import fs from 'fs'

describe('Mocked Release API should', () => {
  it('return releases', async () => {
    const r = new ReleaseAdapter(undefined, 'testowner', ['project1'])
    mockedGetReleasesReturns('./tests/test-data/releases.json')

    const releases: Array<Release> =
      (await r.GetAllReleasesLastMonth()) as Array<Release>

    expect(releases.length).toBeGreaterThan(0)
    expect(releases[0].author.type).toBe('Bot')
    expect(releases.reverse()[0].name).toBe('v0.0.1')
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
