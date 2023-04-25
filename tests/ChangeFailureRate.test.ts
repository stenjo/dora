import { IssueObject } from "../src/IIssue";
import fs from "fs";
import { ChangeFailureRate } from "../src/ChangeFailureRate";

describe("ChangeFailureRate should", () => {
    it("get number of bugs created", () => {
        const bugs: IssueObject[] = JSON.parse(fs.readFileSync('./tests/test-data/issuelist.json', 'utf8'));
        const cfr = new ChangeFailureRate(bugs, new Date("2023-04-23T16:50:53Z"));

        const bugCount = cfr.getBugCount();

        expect(bugCount).toBe(1);

    })

    // "2023-04-22T21:44:06Z"
    it("get number of bugs created when today is more than a month later ", () => {
        const bugs: IssueObject[] = JSON.parse(fs.readFileSync('./tests/test-data/issuelist.json', 'utf8'));
        const cfr = new ChangeFailureRate(bugs, new Date("2023-05-23T16:50:53Z"));

        const bugCount = cfr.getBugCount();

        expect(bugCount).toBe(0);

    })


})