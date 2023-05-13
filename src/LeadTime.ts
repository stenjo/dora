import {Commit} from './interfaces/Commit'
import {PullRequest} from './interfaces/PullRequest'
import {Release} from './interfaces/Release'

const ONE_DAY = 24 * 60 * 60 * 1000
export class LeadTime {
  pulls: PullRequest[]
  releases: number[]
  today: Date
  getCommits: (pullNo: number) => Promise<Commit[]>

  constructor(
    pulls: PullRequest[],
    releases: Release[],
    getCommits: (pullNo: number) => Promise<Commit[]>,
    today: Date | null = null
  ) {
    if (today === null) {
      this.today = new Date()
    } else {
      this.today = today
    }

    this.pulls = pulls.filter(
      p => +new Date(p.merged_at) > this.today.valueOf() - 31 * ONE_DAY
    )
    this.releases = releases.map(r => +new Date(r.published_at))
    this.getCommits = getCommits
  }

  async getLeadTime(): Promise<number> {
    if (this.pulls.length === 0 || this.releases.length === 0) {
      return 0
    }
    const leadTimes: number[] = []
    for (const pull of this.pulls) {
      if (
        typeof pull.merged_at === 'string' &&
        pull.merged_at &&
        pull.base.ref === 'main'
      ) {
        const mergeTime = +new Date(pull.merged_at)
        const laterReleases = this.releases.filter(r => r > mergeTime)
        if (laterReleases.length === 0) {
          continue
        }
        const deployTime = laterReleases[0]
        const commmmits = await this.getCommits(pull.number)
        const commitTime = commmmits
          .map(c => +new Date(c.commit.committer.date))
          .sort((a, b) => a - b)[0]
        leadTimes.push((deployTime - commitTime) / ONE_DAY)
      }
    }
    if (leadTimes.length === 0) {
      return 0
    }

    return (
      Math.round((leadTimes.reduce((p, c) => p + c) / leadTimes.length) * 100) /
      100
    )
  }
}
