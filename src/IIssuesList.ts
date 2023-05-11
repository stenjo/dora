export interface IIssuesList {
    issueList(token: string|undefined, owner: string, repo: string): Promise<unknown>;
}