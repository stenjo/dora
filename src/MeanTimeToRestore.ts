import { IssueObject } from "./IIssue";
import { ReleaseObject } from "./IReleaseList";

export class MeanTimeToRestore {
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

    getBugCount(): Array<{start:string, end:string}> {
        const filters = {
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
        }
            // eslint-disable-next-line @typescript-eslint/no-var-requires
        const jsonQuery = require("json-query");
        const bugs = jsonQuery("[*:labeledBug(" + this.today.valueOf() + ")]", {
        data: this.issues,
        locals: filters,
        }).value;

        let values:Array<{start:string, end:string}> = [];
        bugs.forEach(function (element: IssueObject) {
            values.push({start: element.created_at, end: element.closed_at});
        }, this );

        return values;
    }
    getReleaseTimes(releases: ReleaseObject[]): string[] {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const jsonQuery = require("json-query");
        const dates = jsonQuery("[*].published_at", {
            data: releases,
        }).value;

        return dates;
    }
}