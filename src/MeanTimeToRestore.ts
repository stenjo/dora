import {Issue} from './interfaces/Issue'
import {Release} from './interfaces/Release'

export interface BugTimes {
  start: number
  end: number
}

const ONE_DAY = 1000 * 60 * 60 * 24

export class MeanTimeToRestore {
  today: Date
  issues: Issue[]
  releases: Release[]
  releaseDates: number[] // array of unix times

  constructor(issues: Issue[], releases: Release[], today: Date | null = null) {
    if (today === null) {
      this.today = new Date()
    } else {
      this.today = today
    }
    this.issues = issues
    this.releases = releases
    if (this.releases === null || this.releases.length === 0) {
      throw new Error('Empty release list')
    }
    this.releaseDates = this.getReleaseTimes()
      .map(function (value) {
        return +new Date(value)
      })
      .sort((a, b) => a - b) // Sort ascending
  }

  getTimeDiff(bugTime: BugTimes): number {
    const startTime = +new Date(bugTime.start)
    const endTime = +new Date(bugTime.end)

    return (endTime - startTime) / ONE_DAY
  }

  getBugCount(): BugTimes[] {
    // const filters = {
    //   labeledBug(item: Issue, today: number): boolean {
    //     let found = false
    //     for (const label of item.labels) {
    //       if (label.name === 'bug') {
    //         found = true
    //       }
    //     }
    //     const d = new Date(item.created_at)
    //     return found && d.getTime() > today - 30 * ONE_DAY
    //   }
    // }

    // const jsonQuery = require('json-query')
    // const bugs = jsonQuery(`[*:labeledBug(${this.today.getTime()})]`, {
    //   data: this.issues,
    //   locals: filters
    // }).value

    const bugs: Issue[] = []
    for (const issue of this.issues) {
      const createdAt = +new Date(issue.created_at)
      if (
        issue.labels.filter(label => label.name === 'bug').length > 0 &&
        createdAt > this.today.getTime() - 30 * ONE_DAY
      ) {
        bugs.push(issue)
      }
    }

    // eslint-disable-next-line prefer-const
    let values: BugTimes[] = []
    for (const bug of bugs) {
      const createdAt = +new Date(bug.created_at)
      const closedAt = +new Date(bug.closed_at as string)
      if (
        bug.closed_at != null &&
        this.hasLaterRelease(closedAt) &&
        this.hasPreviousRelease(createdAt)
      ) {
        values.push({
          start: createdAt,
          end: closedAt
        })
      }
    }

    return values
  }
  hasPreviousRelease(date: number): boolean {
    return this.releaseDates.filter(r => r < date).length > 0
  }

  getReleaseTimes(): string[] {
    return this.releases.map(release => release.published_at)
  }

  getReleaseBefore(date: number): number {
    const rdates: number[] = this.releaseDates.filter(r => r < date)

    if (rdates.length === 0) {
      throw new Error('No previous releases')
    }

    return rdates.pop() as number
  }

  getReleaseAfter(date: number): number {
    const rdates: number[] = this.releaseDates.filter(r => r > date)

    if (rdates.length === 0) {
      throw new Error('No later releases')
    }

    return rdates.reverse().pop() as number
  }

  hasLaterRelease(date: number): boolean {
    return this.releaseDates.filter(r => r > date).length > 0
  }

  getRestoreTime(bug: BugTimes): number {
    const prevRel = this.getReleaseBefore(bug.start)
    const nextRel = this.getReleaseAfter(bug.end)

    return nextRel - prevRel
  }

  mttr(): number {
    const ttr: number[] = this.getBugCount().map(bug => {
      return this.getRestoreTime(bug)
    }, this)

    if (ttr.length === 0) {
      return 0
    }

    let sum = 0
    for (const ttrElement of ttr) {
      sum += ttrElement
    }

    return Math.round((sum / ttr.length / ONE_DAY) * 100) / 100 // Two decimals
  }
}
