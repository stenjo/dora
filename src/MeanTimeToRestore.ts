import { IssueObject } from "./IIssue";
import { ReleaseObject } from "./IReleaseList";

export interface BugTimes {
  start: number;
  end: number;
}

const ONE_DAY = 1000 * 60 * 60 * 24;

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

    return (endTime - startTime) / ONE_DAY;
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
        return found && d.getTime() > today - 30 * ONE_DAY;
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
    for (let i = 0; i < bugs.length; i++) {
      if (
        bugs[i].closed_at != null &&
        this.hasLaterRelease(+new Date(bugs[i].closed_at)) &&
        this.hasPreviousRelease(+new Date(bugs[i].created_at))
      ) {
        values.push({
          start: +new Date(bugs[i].created_at),
          end: +new Date(bugs[i].closed_at),
        });
      }
    }

    return values;
  }
  hasPreviousRelease(date: number): boolean {
    return this.releaseDates.filter((r) => r < date).length > 0;
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
    const rdates: number[] = this.releaseDates.filter((r) => r < date);

    if (rdates.length === 0) {
      throw new Error("No previous releases");
    }

    return rdates.pop() as number;
  }

  getReleaseAfter(date: number): number {
    const rdates: number[] = this.releaseDates.filter((r) => r > date);

    if (rdates.length === 0) {
      throw new Error("No later releases");
    }

    return rdates.reverse().pop() as number;
  }

  hasLaterRelease(date: number): boolean {
    return this.releaseDates.filter((r) => r > date).length > 0;
  }

  getRestoreTime(bug: BugTimes): number {
    const prevRel = this.getReleaseBefore(bug.start);
    const nextRel = this.getReleaseAfter(bug.end);

    return nextRel - prevRel;
  }

  mttr(): number {
    const ttr: number[] = this.getBugCount().map((bug) => {
      return this.getRestoreTime(bug);
    }, this);

    if (ttr.length == 0) {
      return 0;
    }

    let sum = 0;
    for (let i = 0; i < ttr.length; i++) {
      sum += ttr[i];
    }

    return Math.round((sum / ttr.length / ONE_DAY) * 100) / 100; // Two decimals
  }
}
