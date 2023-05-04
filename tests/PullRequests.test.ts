import { PullRequests } from "../src/PullRequests";

const ONE_DAY = 24 * 60 * 60 * 1000;

test.skip("fetches tags", async () => {
  const prs = new PullRequests(process.env["GH_TOKEN"], "stenjo", "dora");
  const prlist = await prs.list();

  expect(prlist.length).toBeGreaterThan(-1);
  expect(prlist.length).toBe(30);
  expect(
    prlist.filter((p) => +new Date(p.merged_at) > Date.now() - 7 * ONE_DAY)
      .length
  ).toBe(19);
});
