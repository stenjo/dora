import { IssueObject } from "./IIssue";

export interface IIssuesAdapter {
    today: Date;
    GetAllIssuesLastMonth(): Promise<IssueObject[]|undefined>;
}