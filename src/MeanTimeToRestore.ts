import { IssueObject } from "./IIssue";
import { ReleaseObject } from "./IReleaseList";

export interface BugTimes
{
    start: string;
    end: string;
}

export class MeanTimeToRestore {
    today: Date;
    issues: IssueObject[];
    releases: ReleaseObject[];

    constructor(issues: IssueObject[], releases: ReleaseObject[], today: Date | null = null) {
        if (today === null) {
            this.today = new Date();
          } else {
            this.today = today;
          }
          this.issues = issues;  
          this.releases = releases;
    }

    getTimeDiff(start: string, end: string): number {
        const startTime = +(new Date(start));
        const endTime = +(new Date(end));

        return (endTime - startTime) / (1000*60*60*24);
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

        // eslint-disable-next-line prefer-const
        let values:Array<{start:string, end:string}> = [];
        bugs.forEach(function (element: IssueObject) {
            if(element.closed_at !== null) {
                values.push({start: element.created_at, end: element.closed_at});
            }
        }, this );

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
}