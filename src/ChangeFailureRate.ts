import { IssueObject } from "./IIssue";

export class ChangeFailureRate {
  today: Date;
  issues: IssueObject[];

  constructor(issues: IssueObject[], today: Date | null = null) {
    if (today === null) {
      this.today = new Date();
    } else {
      this.today = today;
    }
    this.issues = issues;
  }

  getBugCount(): number {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const jsonQuery = require("json-query");
    const bugs = jsonQuery("[*:labeledBug(" + this.today.valueOf() + ")].created_at ", {
      data: this.issues,
      locals: {
        labeledBug: function (item: IssueObject, today: number): boolean {
          let found = false;
          item.labels.forEach(function (label) {
            if (label.name === "bug") {
              found = true;
            }
          });
          const d = new Date(item.created_at);
          return found && d.valueOf() > today - (30*24*60*60*1000);
        }
      },
    }).value;

    return bugs.length;
  }
}
