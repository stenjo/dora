import fs from "fs";
//import { issues } from "../src/issues";
import { IssueObject } from "../src/IIssue";

test.skip("fetches issues", async () => {
  // const il = await issues(process.env["GH_TOKEN"], "stenjo", "dora");
  // expect(il?.length).toBeGreaterThan(0);
});

describe("Issues interface should", () => {
  const data:string = fs.readFileSync("./tests/test-data/issue-list.json", {
    encoding: "utf8",
    flag: "r",
  }).trimStart();

  const issues: Array<IssueObject> = JSON.parse(data);
  it("query for issue types", () => {

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const jsonQuery = require('json-query');


    const lst = jsonQuery('[*state=open].title', {data: issues}).value;
    console.log(lst);
    // lst.forEach((element) => {
    //   console.log(element.title);
    // });
  });

});
