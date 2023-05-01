import { IssueObject } from "../src/IIssue";
import { ReleaseObject } from "../src/IReleaseList";
import fs from "fs";
import { BugTimes, MeanTimeToRestore } from "../src/MeanTimeToRestore";

describe("MeanTimeToRestore should", () => {
  const issues: IssueObject[] = JSON.parse(
    fs.readFileSync("./tests/test-data/issue-list.json")
  );
  const releases: ReleaseObject[] = JSON.parse(
    fs.readFileSync("./tests/test-data/releases.json")
  );
  const mttr = new MeanTimeToRestore(
    issues,
    releases,
    new Date("2023-04-30T16:50:53Z")
  );

  it("get bugs last month", () => {
    const bugCount = mttr.getBugCount();

    expect(bugCount.length).toBe(2);
    expect(bugCount[0].start).toBe("2023-04-25T21:21:49Z");
    expect(bugCount[1].end).toBe("2023-04-23T16:47:40Z");
  });

  it("get release times", () => {
    const releaseTimes: string[] = mttr.getReleaseTimes();

    expect(releaseTimes[0]).toEqual("2023-04-30T17:29:44Z");
  });
  
  it("calculate time for a bug", () => {
    const bugTime: BugTimes = {
      start: "2023-04-25T21:21:49Z",
      end: "2023-04-26T21:21:49Z",
    };
    const restoreTime: number = mttr.getTimeDiff(bugTime);

    expect(restoreTime).toBe(1);
  });
});
