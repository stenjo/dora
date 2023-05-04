import { CommitObject } from "../src/ICommitsList";
import { PullRequestObject } from "../src/IPullRequest";
import { LeadTime } from "../src/LeadTime";

describe("LeadTime should", () => {
  it("return 0 on no pullrequests", async () => {
    const pulls = [] as PullRequestObject[];
    const lt = new LeadTime(pulls, async() => [{}] as CommitObject[], new Date());

    const leadTime = await lt.getLeadTime();

    expect(leadTime).toBe(0);
  });

  it("return 0 on no closed pullrequests", async () => {
    const pulls = [
      {
        merged_at: "",
      },
    ] as PullRequestObject[];
    const lt = new LeadTime(pulls, async () => [{}] as CommitObject[], new Date());

    const leadTime = await lt.getLeadTime();

    expect(leadTime).toBe(0);
  });
  it("return 0 on no pullrequests with base.ref = main", async () => {
    const pulls = [
      {
        merged_at: "2023-04-29T17:50:53Z",
        base: {
          ref: "other",
        },
      },
    ] as PullRequestObject[];
    const lt = new LeadTime(pulls, async () => [{}] as CommitObject[], new Date());

    const leadTime = await lt.getLeadTime();

    expect(leadTime).toBe(0);
  });

  it("return 0 on 1 pullrequest with no commits", async () => {
    const pulls = [] as PullRequestObject[];
    const lt = new LeadTime(pulls, async () => [{}] as CommitObject[], new Date());

    const leadTime = await lt.getLeadTime();

    expect(leadTime).toBe(0);
  });

  it("return 7 on pullrequests with base.ref = main", async () => {
    const pulls = [
      {
        merged_at: "2023-04-29T17:50:53Z",
        base: {
          ref: "main",
        },
      },
    ] as PullRequestObject[];
    const lt = new LeadTime(
      pulls,
      async () => {
        return [
          {
            commit: {
              committer: {
                date: "2023-04-22T17:50:53Z",
              },
            },
          },
        ] as CommitObject[];
      },
      new Date()
    );

    const leadTime = await lt.getLeadTime();

    expect(leadTime).toBe(7);
  });
  it("return 0 on too old pullrequests", async () => {
    const pulls = [
      {
        merged_at: "2023-04-29T17:50:53Z",
        base: {
          ref: "main",
        },
      },
    ] as PullRequestObject[];
    const lt = new LeadTime(
      pulls,
      async () => {
        return [
          {
            commit: {
              committer: {
                date: "2023-04-22T17:50:53Z",
              },
            },
          },
        ] as CommitObject[];
      },
      new Date("2023-06-29T17:50:53Z")
    );

    const leadTime = await lt.getLeadTime();

    expect(leadTime).toBe(0);
  });
  it("return 10 on pullrequests with two commits", async () => {
    const pulls = [
      {
        merged_at: "2023-04-29T17:50:53Z",
        base: {
          ref: "main",
        },
      },
    ] as PullRequestObject[];
    const lt = new LeadTime(
      pulls,
      async () => {
        return [
          {
            commit: {
              committer: {
                date: "2023-04-22T17:50:53Z",
              },
            },
          },
          {
            commit: {
              committer: {
                date: "2023-04-19T17:50:53Z",
              },
            },
          },
        ] as CommitObject[];
      },
      new Date()
    );

    const leadTime = await lt.getLeadTime();

    expect(leadTime).toBe(10);
  });


  it("return 7.5 on two pullrequests with two commits", async () => {
    const pulls = [
      {
        merged_at: "2023-04-29T17:50:53Z",
        number: 47,
        base: {
          ref: "main",
        },
      },
      {
        merged_at: "2023-04-27T17:50:53Z",
        number: 10,
        base: {
          ref: "main",
        },
      },
    ] as PullRequestObject[];
    const lt = new LeadTime(
      pulls,
      async (pullId: number) => {
        if (pullId === 10) {
          return [
            {
              commit: {
                committer: {
                  date: "2023-04-22T17:50:53Z",
                },
              },
            },
          ] as CommitObject[];
        }
        if (pullId === 47) {
          return [
            {
              commit: {
                committer: {
                  date: "2023-04-19T17:50:53Z",
                },
              },
            },
          ] as CommitObject[];
        }
        return [];
      },
      new Date()
    );

    const leadTime = await lt.getLeadTime();

    expect(leadTime).toBe(7.5);
  });
});
