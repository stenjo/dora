import fs from 'fs'
import {IssuesAdapter} from '../src/IssuesAdapter'
import {IIssuesAdapter} from '../src/interfaces/IIssuesAdapter'
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
    const getIssuesMock = jest.spyOn(
      IssuesAdapter.prototype as any,
      'getIssues'
    )
    getIssuesMock.mockImplementation((): Promise<Issue[]> => {
      return Promise.resolve(
        JSON.parse(
          fs.readFileSync('./tests/test-data/issue-list.json').toString()
        ) as Issue[]
      )
    })

    const il = await issueAdapter.GetAllIssuesLastMonth()
    expect(il?.length).toBe(30)
  })
})
