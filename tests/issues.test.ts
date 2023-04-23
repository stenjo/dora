import fs from "fs";
//import { issues } from "../src/issues";
import { IssueObject } from "../src/IIssue";

test.skip("fetches issues", async () => {
  // const il = await issues(process.env["GH_TOKEN"], "stenjo", "dora");
  // expect(il?.length).toBeGreaterThan(0);
});

describe("Issues interface should", () => {
  const data: string = fs.readFileSync("./tests/test-data/issuelist.json", {
    encoding: "utf8",
    flag: "r",
  });

  const issues: Array<IssueObject> = JSON.parse(data);
  it("query for issue types", () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const jsonQuery = require("json-query");

    let lst: Array<string> = jsonQuery("[*state=open].title", {
      data: issues,
    }).value;
    // console.log(lst);

    lst = jsonQuery("[*:oneWeek].title", {
      data: issues,
      locals: {
        oneWeek: function (item: IssueObject) {
          const d = new Date(item.created_at);
          const now = new Date("2023-04-23T20:51:14Z");
          // return d.valueOf() > Date.now() - 18 * 60 * 60 * 1000;
          return d.valueOf() > now.valueOf() - 24 * 60 * 60 * 1000;
        },
      },
    }).value;
    // console.log(lst);

    expect(lst.length).toBe(5);
  });

  it("get number of bugs last month", () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const jsonQuery = require("json-query");
    const bugs = jsonQuery("[*:labeledBug].created_at", {
      data: issues,
      locals: {
        labeledBug: function (item: IssueObject) {
          let found = false;
          item.labels.forEach(function (label) {
              if (label.name === "bug") {
                found = true;
              };
            });
          return found;
        },
      },
    }).value;

    console.log(bugs);
    expect(bugs.length).toBe(1);
  });

});
