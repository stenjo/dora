import { IssueObject } from "../src/IIssue";
import fs from "fs";
import { ChangeFailureRate } from "../src/ChangeFailureRate";
import { ReleaseObject } from "../src/IReleaseList";

describe("ChangeFailureRate should", () => {
  it("get number of bugs created", () => {
    const issues: IssueObject[] = JSON.parse(
      fs.readFileSync("./tests/test-data/issuelist.json", "utf8")
    );
    const rels: ReleaseObject[] = JSON.parse(
      fs.readFileSync("./tests/test-data/releases.json", "utf8")
    );
    const cfr = new ChangeFailureRate(
      issues,
      rels,
      new Date("2023-04-23T16:50:53Z")
    );

    const bugs = cfr.getBugs();

    expect(bugs.length).toBe(1);
  });

  it("get percentage rate", () => {
    const bugs: IssueObject[] = JSON.parse(
      fs.readFileSync("./tests/test-data/issuelist.json", "utf8")
    );
    const rels: ReleaseObject[] = JSON.parse(
      fs.readFileSync("./tests/test-data/releases.json", "utf8")
    );
    const cfr = new ChangeFailureRate(
      bugs,
      rels,
      new Date("2023-04-23T16:50:53Z")
    );

    const cfrPercentage = cfr.Cfr();

    expect(cfrPercentage).toBe(14);
  });

  it("calculate 0 failures on 0 releases", () => {
    const bugs: IssueObject[] = JSON.parse(
      fs.readFileSync("./tests/test-data/issue-list.json", "utf8")
    );
    const rels: ReleaseObject[] = [];

    const cfr = new ChangeFailureRate(
      bugs,
      rels,
      new Date("2023-04-30T17:50:53Z")
    );

    const value = cfr.Cfr();

    expect(value).toBe(0);
  });

  it("calculate 0 failures on 0 issues", () => {
    const bugs: IssueObject[] = [];
    const rels: ReleaseObject[] = JSON.parse(
      fs.readFileSync("./tests/test-data/releases.json", "utf8")
    );

    const cfr = new ChangeFailureRate(
      bugs,
      rels,
      new Date("2023-04-30T17:50:53Z")
    );

    const value = cfr.Cfr();

    expect(value).toBe(0);
  });

  it("calculate 100% failures on 1 issues on 1 release", () => {
    const bugs = [
      {
        created_at: "2023-04-30T17:50:53Z",
        labels: [{ name: "bug" }],
      },
    ] as IssueObject[];

    const rels = [
      {
        published_at: "2023-04-30T16:50:53Z",
      },
    ] as ReleaseObject[];

    const cfr = new ChangeFailureRate(
      bugs,
      rels,
      new Date("2023-04-30T17:50:53Z")
    );

    const value = cfr.Cfr();

    expect(value).toBe(100);
  });

  it("calculate 50% failures on 1 issues on 2 releases", () => {
    const bugs = [
      {
        created_at: "2023-04-30T17:50:53Z",
        labels: [{ name: "bug" }],
      },
    ] as IssueObject[];

    const rels = [
      {
        published_at: "2023-04-30T16:50:53Z",
      },
      {
        published_at: "2023-04-29T16:50:53Z",
      },
    ] as ReleaseObject[];

    const cfr = new ChangeFailureRate(
      bugs,
      rels,
      new Date("2023-04-30T17:50:53Z")
    );

    const value = cfr.Cfr();

    expect(value).toBe(50);
  });

  it("calculate 0% failures on 1 issues that is not a bug on 2 releases", () => {
    const bugs = [
      {
        created_at: "2023-04-30T17:50:53Z",
        labels: [{ name: "feature" }],
      },
    ] as IssueObject[];

    const rels = [
      {
        published_at: "2023-04-30T16:50:53Z",
      },
      {
        published_at: "2023-04-29T16:50:53Z",
      },
    ] as ReleaseObject[];

    const cfr = new ChangeFailureRate(
      bugs,
      rels,
      new Date("2023-04-30T17:50:53Z")
    );

    const value = cfr.Cfr();

    expect(value).toBe(0);
  });

  it("calculate 50% failures on 2 issues after latest release", () => {
    const bugs = [
      {
        created_at: "2023-04-30T17:50:53Z",
        labels: [{ name: "bug" }],
      },
      {
        created_at: "2023-04-30T17:50:53Z",
        labels: [{ name: "bug" }],
      },
    ] as IssueObject[];

    const rels = [
      {
        published_at: "2023-04-30T16:50:53Z",
      },
      {
        published_at: "2023-04-29T16:50:53Z",
      },
    ] as ReleaseObject[];

    const cfr = new ChangeFailureRate(
      bugs,
      rels,
      new Date("2023-04-30T17:50:53Z")
    );

    const value = cfr.Cfr();

    expect(value).toBe(50);
  });

  it("calculate 100% failures on 2 issues after no releases this month", () => {
    const bugs = [
      {
        created_at: "2023-04-29T17:50:53Z",
        labels: [{ name: "bug" }],
      },
      {
        created_at: "2023-04-31T17:50:53Z",
        labels: [{ name: "bug" }],
      },
    ] as IssueObject[];

    const rels = [
      {
        published_at: "2023-04-30T16:50:53Z",
      },
      {
        published_at: "2023-04-29T16:50:53Z",
      },
    ] as ReleaseObject[];

    const cfr = new ChangeFailureRate(
      bugs,
      rels,
      new Date("2023-05-30T17:50:53Z")
    );

    const value = cfr.Cfr();

    expect(value).toBe(100);
  });

  it("calculate 100% failures on 2 issues after latest release and one before", () => {
    const bugs = [
      {
        created_at: "2023-04-29T17:50:53Z",
        labels: [{ name: "bug" }],
      },
      {
        created_at: "2023-04-30T17:50:53Z",
        labels: [{ name: "bug" }],
      },
      {
        created_at: "2023-04-30T17:50:53Z",
        labels: [{ name: "bug" }],
      },
    ] as IssueObject[];

    const rels = [
      {
        published_at: "2023-04-30T16:50:53Z",
      },
      {
        published_at: "2023-04-29T16:50:53Z",
      },
    ] as ReleaseObject[];

    const cfr = new ChangeFailureRate(
      bugs,
      rels,
      new Date("2023-04-30T17:50:53Z")
    );

    const value = cfr.Cfr();

    expect(value).toBe(100);
  });

  it("calculate 33% failures on 3 issues after first release and none after second of 3 releases", () => {
    const bugs = [
      {
        created_at: "2023-04-29T17:50:53Z",
        labels: [{ name: "bug" }],
      },
      {
        created_at: "2023-04-30T17:50:53Z",
        labels: [{ name: "bug" }],
      },
      {
        created_at: "2023-04-30T17:50:53Z",
        labels: [{ name: "bug" }],
      },
    ] as IssueObject[];

    const rels = [
      {
        published_at: "2023-04-28T16:50:53Z",
      },
      {
        published_at: "2023-04-30T19:50:53Z",
      },
      {
        published_at: "2023-05-02T16:50:53Z",
      },
    ] as ReleaseObject[];

    const cfr = new ChangeFailureRate(
      bugs,
      rels,
      new Date("2023-04-30T17:50:53Z")
    );

    const value = cfr.Cfr();

    expect(value).toBe(33);
  });

  it("calculate 50% failures on 3 issues after first release no older than a month", () => {
    const bugs = [
      {
        created_at: "2023-04-29T17:50:53Z",
        labels: [{ name: "bug" }],
      },
      {
        created_at: "2023-04-30T17:50:53Z",
        labels: [{ name: "bug" }],
      },
      {
        created_at: "2023-04-30T17:50:53Z",
        labels: [{ name: "bug" }],
      },
    ] as IssueObject[];

    const rels = [
      {
        published_at: "2023-04-28T16:50:53Z",
      },
      {
        published_at: "2023-04-30T19:50:53Z",
      },
      {
        published_at: "2023-04-02T16:50:53Z",
      },
    ] as ReleaseObject[];

    const cfr = new ChangeFailureRate(
      bugs,
      rels,
      new Date("2023-05-29T10:50:53Z")
    );

    const value = cfr.Cfr();

    expect(value).toBe(50);
  });
});
