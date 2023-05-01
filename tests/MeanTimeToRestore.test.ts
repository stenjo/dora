import { IssueObject } from "../src/IIssue";
import { ReleaseObject } from "../src/IReleaseList";
import fs from "fs";
import { BugTimes, MeanTimeToRestore } from "../src/MeanTimeToRestore";

describe("MeanTimeToRestore should", () => {
  const issues: IssueObject[] = JSON.parse(
    fs.readFileSync("./tests/test-data/issue-list.json").toString()
  );
  const releases: ReleaseObject[] = JSON.parse(
    fs.readFileSync("./tests/test-data/releases.json").toString()
  );
  const mttr = new MeanTimeToRestore(
    issues,
    releases,
    new Date("2023-04-30T16:50:53Z")
  );

  it("get bugs last month", () => {
    const bugCount = mttr.getBugCount();

    expect(bugCount.length).toBe(2);
    expect(bugCount[0].start).toBe(+new Date("2023-04-25T21:21:49Z"));
    expect(bugCount[1].end).toBe(+new Date("2023-04-23T16:47:40Z"));
  });

  it("get release times", () => {
    const releaseTimes: string[] = mttr.getReleaseTimes();

    expect(releaseTimes[0]).toEqual("2023-04-30T17:29:44Z");
  });

  it("calculate time for a bug", () => {
    const bugTime: BugTimes = {
      start: +new Date("2023-04-25T21:21:49Z"),
      end: +new Date("2023-04-26T21:21:49Z"),
    };
    const restoreTime: number = mttr.getTimeDiff(bugTime);

    expect(restoreTime).toBe(1);
  });

  it("find release time before date", () => {

    const before1: number = mttr.getReleaseBefore(+new Date("2023-04-25T21:21:49Z"));
    const before2: number = mttr.getReleaseBefore(+new Date("2023-04-29T12:54:45Z"));

    expect(before1).toBe(+(new Date("2023-04-22T20:28:29Z")));
    expect(before2).toBe(+(new Date("2023-04-29T06:18:36Z")));
  })

  it("throw error when no earlier dates", () => {

    const t = () => {
      mttr.getReleaseBefore(+new Date("2023-04-05T21:21:49Z"));
    }

    expect(t).toThrow("No previous releases");
  })

  it("find release time after date", () => {

    const after1: number = mttr.getReleaseAfter(+new Date("2023-04-25T21:21:49Z"));
    const after2: number = mttr.getReleaseAfter(+new Date("2023-04-29T12:54:45Z"));

    expect(after1).toBe(+(new Date("2023-04-29T06:18:36Z")));
    expect(after2).toBe(+(new Date("2023-04-30T16:06:06Z")));
  })

  it("throw error when no later dates", () => {

    const t = () => {
      mttr.getReleaseAfter(+new Date("2023-05-05T21:21:49Z"));
    }

    expect(t).toThrow("No later releases");
  })

  it("check if there are later releases", () => {

    const hasLaterRelease:boolean = mttr.hasLaterRelease(+new Date("2023-04-29T12:54:45Z"));
    const hasNoLaterRelease:boolean = mttr.hasLaterRelease(+new Date("2023-04-30T17:29:44Z"));

    expect(hasLaterRelease).toBe(true);
    expect(hasNoLaterRelease).toBe(false);

  })

  it("get time for a bug 1", () => {

    const bug:BugTimes = {start:(+new Date("2023-04-22T21:44:06Z")), end:(+new Date("2023-04-23T16:47:40Z"))};
    const releaseDiff = +new Date("2023-04-29T06:18:36Z") - +new Date("2023-04-22T20:28:29Z");

    const fixTime:number = mttr.getRestoreTime(bug);

    expect(fixTime).toBe(releaseDiff);
    // console.log(fixTime/(1000*60*60*24))
  })
  it("get time for a bug 2", () => {

    const bug:BugTimes = {start:(+new Date("2023-04-25T21:21:49Z")), end:(+new Date("2023-04-29T12:54:45Z"))};
    const releaseDiff = +new Date("2023-04-30T16:06:06Z") - +new Date("2023-04-22T20:28:29Z");

    const fixTime:number = mttr.getRestoreTime(bug);

    expect(fixTime).toBe(releaseDiff);

    // console.log(fixTime/(1000*60*60*24))
  })

  it("get average time to repair", () => {

    const avMttr: number = mttr.mttr();

    expect(avMttr).toBeGreaterThan(6.4);
    expect(avMttr).toBeLessThan(7.9);

    // console.log(avMttr);
  })

  it("throw excepiton when no releases", ()=>{
    const emptyReleaseList : ReleaseObject[] = [];

    const t = () => {
      new MeanTimeToRestore(issues, emptyReleaseList);
    }

    expect(t).toThrow("Empty release list");
        
  })

  it("return 0 when no bugs", () => {
    const emptyBugList : IssueObject[] = [];

    const mttrEmpty = new MeanTimeToRestore(emptyBugList, releases);
    const meanTime = mttrEmpty.mttr();

    expect(meanTime).toBe(0);

  })
});
