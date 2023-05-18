// import {Commit} from './interfaces/Commit'
import {PullRequest} from './types/PullRequest'
import {Release} from './types/Release'
import {ICommitsAdapter} from './interfaces/ICommitsAdapter'
import {Commit} from './types/Commit'

const ONE_DAY = 24 * 60 * 60 * 1000
export class LeadTime {
  pulls: PullRequest[]
  releases: {published: number; url: string}[]
  today: Date
  commitsAdapter: ICommitsAdapter

  constructor(
    pulls: PullRequest[],
    releases: Release[],
    commitsAdapter: ICommitsAdapter,
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
    this.releases = releases.map(r => {
      return {published: +new Date(r.published_at), url: r.url}
    })
    this.commitsAdapter = commitsAdapter
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
        typeof pull.base.repo.name === 'string' &&
        pull.base.repo.name &&
        pull.base.ref === 'main'
      ) {
        const mergeTime = +new Date(pull.merged_at)
        const laterReleases = this.releases.filter(
          r => r.published > mergeTime && r.url.includes(pull.base.repo.name)
        )
        if (laterReleases.length === 0) {
          continue
        }
        const deployTime: number = laterReleases[0].published
        const commmmits = (await this.commitsAdapter.getCommitsFromUrl(
          pull.commits_url
        )) as Commit[]
        const commitTime: number = commmmits
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
