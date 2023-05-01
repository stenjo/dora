import { IssueObject } from "./IIssue";
import { ReleaseObject } from "./IReleaseList";

export interface BugTimes {
  start: number;
  end: number;
}

export class MeanTimeToRestore {
  today: Date;
  issues: IssueObject[];
  releases: ReleaseObject[];
  releaseDates: number[]; // array of unix times

  constructor(
    issues: IssueObject[],
    releases: ReleaseObject[],
    today: Date | null = null
  ) {
    if (today === null) {
      this.today = new Date();
    } else {
      this.today = today;
    }
    this.issues = issues;
    this.releases = releases;
    if (this.releases == null || this.releases.length == 0) {
      throw new Error("Empty release list");
    }
    this.releaseDates = this.getReleaseTimes()
      .map(function (value) {
        return +new Date(value);
      })
      .sort(); // Sort ascending
  }

  getTimeDiff(bugTime: BugTimes): number {
    const startTime = +new Date(bugTime.start);
    const endTime = +new Date(bugTime.end);

    return (endTime - startTime) / (1000 * 60 * 60 * 24);
  }

  getBugCount(): Array<BugTimes> {
    const filters = {
      labeledBug: function (item: IssueObject, today: number): boolean {
        let found = false;
        item.labels.forEach(function (label) {
          if (label.name === "bug") {
            found = true;
          }
        });
        const d = new Date(item.created_at);
        return found && d.getTime() > today - 30 * 24 * 60 * 60 * 1000;
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const jsonQuery = require("json-query");
    const bugs = jsonQuery("[*:labeledBug(" + this.today.getTime() + ")]", {
      data: this.issues,
      locals: filters,
    }).value;

    // eslint-disable-next-line prefer-const
    let values: Array<BugTimes> = [];
    bugs.forEach(function (element: IssueObject) {
      if (element.closed_at !== null) {
        values.push({
          start: +new Date(element.created_at),
          end: +new Date(element.closed_at),
        });
      }
    }, this);

    return values;
  }

  getReleaseTimes(): string[] {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const jsonQuery = require("json-query");
    const dates = jsonQuery("[*].published_at", {
      data: this.releases,
    }).value;

    return dates;
  }

  getReleaseBefore(date: number): number {
    const decDates: number[] = this.releaseDates.sort((a, b) =>
      a > b ? -1 : 1
    ); // Sort decending
    const bugDate: number = +new Date(date);

    for (const index in decDates) {
      if (decDates[index] < bugDate) {
        return decDates[index];
      }
    }

    throw new Error("No previous releases");
  }

  getReleaseAfter(date: number): number {
    const ascDates: number[] = this.releaseDates.sort(); // Sort ascending

    for (const index in ascDates) {
      if (ascDates[index] > date) {
        return ascDates[index];
      }
    }

    throw new Error("No later releases");
  }

  hasLaterRelease(date: number): boolean {
    const decDates: number[] = this.releaseDates.sort((a, b) =>
      a > b ? -1 : 1
    ); // Sort decending

    return decDates[0] > date;
  }

  getRestoreTime(bug: BugTimes): number {
    const prevRel = this.getReleaseBefore(bug.start);
    const nextRel = this.getReleaseAfter(bug.end);

    return nextRel - prevRel;
  }

  mttr(): number {
    const ttr: number[] = this.getBugCount().map( (bug) => {
      return this.getRestoreTime(bug);
    }, this);

    if (ttr.length == 0) {
      return 0;
    }

    let sum = 0;
    for (let i = 0; i < ttr.length; i++) {
      sum += ttr[i];
    }

    return Math.round(sum / ttr.length / (10 * 60 * 60 * 24))/100; // Two decimals
  }
}
