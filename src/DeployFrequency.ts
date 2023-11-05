//

import {Release} from './types/Release'

// The number of milliseconds in one day
const ONE_DAY = 1000 * 60 * 60 * 24

export class DeployFrequency {
  today: Date = new Date()
  rList: Release[] = new Array<Release>()

  constructor(releases: Release[] | null, dateString: string | null = null) {
    this.rList = releases as Release[]
    if (this.rList === null || this.rList.length === 0) {
      throw new Error('Empty release list')
    }

    if (dateString !== null) {
      this.today = new Date(dateString)
    }
  }

  weekly(): number {
    let releaseCount = 0
    for (const release of this.rList) {
      const relDate = new Date(release.published_at)
      if (this.days_between(this.today, relDate) < 8) {
        releaseCount++
      }
    }

    return releaseCount
  }

  monthly(): number {
    let releaseCount = 0
    for (const release of this.rList) {
      const relDate = new Date(release.published_at)
      if (this.days_between(this.today, relDate) < 31) {
        releaseCount++
      }
    }

    return releaseCount
  }

  rate(): string {
    return (Math.round(this.monthly() * 700) / 3000).toFixed(2)
  }

  private days_between(date1: Date, date2: Date): number {
    // Calculate the difference in milliseconds
    const differenceMs = Math.abs(date1.valueOf() - date2.valueOf())

    // Convert back to days and return
    return Math.round(differenceMs / ONE_DAY)
  }
}
