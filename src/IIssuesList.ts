import { IssueObject } from "./IIssue";

export interface IIssuesList {
    GetAllIssuesLastMonth(): Promise<IssueObject[]|undefined>;
}