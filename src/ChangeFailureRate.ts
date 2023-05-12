import { IssueObject } from "./interfaces/IIssue";
import { ReleaseObject } from "./interfaces/IRelease";

export class ChangeFailureRate {
  today: Date;
  issues: IssueObject[];
  releases: ReleaseObject[];

  constructor(
    issues: IssueObject[],
    rels: ReleaseObject[],
    today: Date | null = null
  ) {
      today === null ? this.today = new Date() : this.today = today;
      this.issues = issues;
      this.releases = rels
        .sort((a, b) =>
          +new Date(a.published_at) < +new Date(b.published_at) ? -1 : 1
        )
        .filter(
          (r) =>
            +new Date(r.published_at) >
            this.today.valueOf() - 31 * 24 * 60 * 60 * 1000
        );
  }

  getBugs(): IssueObject[] {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const jsonQuery = require("json-query");
    const bugs = jsonQuery("[*:labeledBug]", {
      data: this.issues,
      locals: {
        labeledBug: function (item: IssueObject): boolean {
          let found = false;
          item.labels.forEach(function (label) {
            if (label.name === "bug") {
              found = true;
            }
          });
          return found;
        },
      },
    }).value;

    return bugs;
  }

  Cfr(): number {
    if (this.issues.length === 0 || this.releases.length === 0) {
      return 0;
    }
    const bugDates = this.getBugs().map((issue) => +new Date(issue.created_at));
    const releaseDates = this.releases.map(
      (release) => +new Date(release.published_at)
    );
    releaseDates.push(Date.now());

    let failedDeploys = 0;
    for (let i = 0; i < releaseDates.length - 1; i++) {
      if (
        bugDates.filter(
          (value) => value > releaseDates[i] && value < releaseDates[i + 1]
        ).length > 0
      ) {
        failedDeploys += 1;
      }
    }
    return Math.round((failedDeploys / this.releases.length) * 100);
  }
}
