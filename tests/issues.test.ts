import fs from 'fs'
import {IssuesAdapter} from '../src/IssuesAdapter'
import {IIssuesAdapter} from '../src/interfaces/IIssuesAdapter'
import {Issue} from '../src/interfaces/Issue'
import * as dotenv from 'dotenv'

dotenv.config()

describe.skip('Real Issues API should', () => {
  const issueAdapter = new IssuesAdapter(
    process.env['GH_TOKEN'],
    'stenjo',
    'dora'
  )

  test('fetch issues', async () => {
    const il = await issueAdapter.GetAllIssuesLastMonth()
    expect(il?.length).toBeGreaterThan(66)
  })
})

class IssuesMock implements IIssuesAdapter {
  today: Date

  constructor() {
    this.today = new Date()
  }

  async GetAllIssuesLastMonth(): Promise<Issue[]> {
    const data: string = fs.readFileSync('./tests/test-data/issuelist.json', {
      encoding: 'utf8',
      flag: 'r'
    })
    const issues: Array<Issue> = JSON.parse(data)

    return Promise.resolve(issues)
  }
}

describe('Issues interface should', () => {
  it('query for issue types', async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const jsonQuery = require('json-query')

    const im = new IssuesMock()
    const issues = await im.GetAllIssuesLastMonth()
    let lst: Array<string> = jsonQuery('[*state=open].title', {
      data: issues
    }).value
    // console.log(lst);

    lst = jsonQuery('[*:oneWeek].title', {
      data: issues,
      locals: {
        oneWeek: function (item: Issue) {
          const d = new Date(item.created_at)
          const now = new Date('2023-04-23T20:51:14Z')
          // return d.valueOf() > Date.now() - 18 * 60 * 60 * 1000;
          return d.valueOf() > now.valueOf() - 24 * 60 * 60 * 1000
        }
      }
    }).value
    // console.log(lst);

    expect(lst.length).toBe(5)
  })

  it('get number of bugs last month', async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const jsonQuery = require('json-query')
    const im = new IssuesMock()
    const issues = await im.GetAllIssuesLastMonth()
    const bugs = jsonQuery('[*:labeledBug].created_at', {
      data: issues,
      locals: {
        labeledBug: function (item: Issue) {
          let found = false
          item.labels.forEach(function (label) {
            if (label.name === 'bug') {
              found = true
            }
          })
          return found
        }
      }
    }).value

    // console.log(bugs);
    expect(bugs.length).toBe(1)
  })
})
