import fs from 'fs'
import {IssuesAdapter} from '../src/IssuesAdapter'
import {Issue} from '../src/types/Issue'
import * as dotenv from 'dotenv'

dotenv.config()

describe.skip('Real Issues API should', () => {
  const issueAdapter = new IssuesAdapter(process.env['GH_TOKEN'], 'stenjo', [
    'dora'
  ])

  test('fetch issues', async () => {
    const il = await issueAdapter.GetAllIssuesLastMonth()
    expect(il?.length).toBeGreaterThan(66)
  })
})

describe('mocked Issues API should', () => {
  test('return issues', async () => {
    const issueAdapter = new IssuesAdapter(process.env['GH_TOKEN'], 'stenjo', [
      'dora'
    ])
    mockedGetIssuesReturns('./tests/test-data/issue-list.json')

    const il = await issueAdapter.GetAllIssuesLastMonth()
    expect(il?.length).toBe(30)
  })
})

function mockedGetIssuesReturns(file: string) {
  const getIssuesMock = jest.spyOn(IssuesAdapter.prototype as any, 'getIssues')
  getIssuesMock.mockImplementation((): Promise<Issue[]> => {
    return Promise.resolve(
      JSON.parse(fs.readFileSync(file).toString()) as Issue[]
    )
  })
}
