import { CommitObject } from "../src/ICommitsList";
import { PullRequestObject } from "../src/IPullRequest";
import { ReleaseObject } from "../src/IReleaseList";
import { LeadTime } from "../src/LeadTime";

describe("LeadTime should", () => {
  it("return 0 on no pullrequests", async () => {
    const pulls = [] as PullRequestObject[];
    const lt = new LeadTime(
      pulls,
      [ { published_at: "2023-04-30T17:50:53Z" }] as ReleaseObject[],
      async () => [{}] as CommitObject[],
      new Date()
    );

    const leadTime = await lt.getLeadTime();

    expect(leadTime).toBe(0);
  });

  it("return 0 on no closed pullrequests", async () => {
    const pulls = [
      {
        merged_at: "",
      },
    ] as PullRequestObject[];
    const lt = new LeadTime(
      pulls,
      [ { published_at: "2023-04-30T17:50:53Z" }] as ReleaseObject[],
      async () => [{}] as CommitObject[],
      new Date()
    );

    const leadTime = await lt.getLeadTime();

    expect(leadTime).toBe(0);
  });
  it("return 0 on no releases", async () => {
    const pulls = [
      {
        merged_at: "2023-04-28T17:50:53Z", // 30-22 = 8
        base: { ref: "main", },
      },
    ] as PullRequestObject[];
    const lt = new LeadTime(
      pulls,
      [],
      async () => [{}] as CommitObject[],
      new Date()
    );

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
    const lt = new LeadTime(
      pulls,
      [],
      async () => [{}] as CommitObject[],
      new Date()
    );

    const leadTime = await lt.getLeadTime();

    expect(leadTime).toBe(0);
  });

  it("return 0 on 1 pullrequest with no commits", async () => {
    const pulls = [] as PullRequestObject[];
    const lt = new LeadTime(
      pulls,
      [],
      async () => [{}] as CommitObject[],
      new Date()
    );

    const leadTime = await lt.getLeadTime();

    expect(leadTime).toBe(0);
  });

  it("return 8 on pullrequests with base.ref = main", async () => {
    const pulls = [
      {
        merged_at: "2023-04-28T17:50:53Z", // 30-22 = 8
        base: { ref: "main", },
      },
    ] as PullRequestObject[];
    const rels = [ { published_at: "2023-04-30T17:50:53Z", }, ] as ReleaseObject[];
    const lt = new LeadTime(
      pulls,
      rels,
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

    expect(leadTime).toBe(8);
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
    const rels = [ { published_at: "2023-04-30T17:50:53Z", }, ] as ReleaseObject[];
    const lt = new LeadTime(
      pulls,
      rels,
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
  it("return 11 on pullrequests with two commits", async () => {
    const pulls = [
      {
        merged_at: "2023-04-29T17:50:53Z",  // 30-19 = 11
        base: {
          ref: "main",
        },
      },
    ] as PullRequestObject[];
    const rels = [ { published_at: "2023-04-30T17:50:53Z", }, ] as ReleaseObject[];
    const lt = new LeadTime(
      pulls,
      rels,
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

    expect(leadTime).toBe(11);
  });

  it("return 8.5 on two pullrequests with two commits", async () => {
    // getCommits()
    // Returning commits from (10)=>22/4, (15)=>27/4 and (47)=>19/4
    const pulls = [
      {
        merged_at: "2023-04-29T17:50:53Z",  // 30-19 = 11
        number: 47,
        base: {
          ref: "main",
        },
      },
      {
        merged_at: "2023-04-27T17:50:53Z",  // 28-22 = 6
        number: 10,
        base: {
          ref: "main",
        },
      },
    ] as PullRequestObject[];
    const rels = [
      {
        published_at: "2023-04-28T17:50:53Z",
      },
      {
        published_at: "2023-04-30T17:50:53Z",
      },
      {
        published_at: "2023-04-02T17:50:53Z",
      },
    ] as ReleaseObject[];
    const lt = new LeadTime(pulls, rels, getCommits, new Date());

    const leadTime = await lt.getLeadTime();

    expect(leadTime).toBe(8.5); // (11+6)/2

  });

  it("return 6,67 on three pullrequests with one commit each", async () => {
    // getCommits()
    // Returning commits from (10)=>22/4, (15)=>27/4 and (47)=>19/4

    const pulls = [
      { 
        merged_at: "2023-04-29T17:50:53Z",  // Has a commit 19/4, first release is 30/4 -> Lead time 11 days
        number: 47,
        base: {
          ref: "main",
        },
      },
      {
        merged_at: "2023-04-27T17:50:53Z", //  Has a commit 22/4, first release is 28/4 -> Lead time 6 days
        number: 10,
        base: {
          ref: "main",
        },
      },
      {
        merged_at: "2023-04-29T17:50:53Z", //  Has a commit 27/4, first release is 30/4 -> Lead time 3 days
        number: 15,
        base: {
          ref: "main",
        },
      },
    ] as PullRequestObject[];

    const rels = [
      {
        published_at: "2023-04-28T17:50:53Z",
      },
      {
        published_at: "2023-04-30T17:50:53Z",
      },
      {
        published_at: "2023-04-02T17:50:53Z",
      },
    ] as ReleaseObject[];

    const lt = new LeadTime(pulls, rels, getCommits, new Date());

    const leadTime = await lt.getLeadTime();

    expect(leadTime).toBe(6.67); // (11+6+3)/3 

  });

  // Returning commits from (10)=>22/4, (15)=>27/4 and (47)=>19/4
  async function getCommits(pullId: number): Promise<CommitObject[]> {
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
    if (pullId === 15) {
      return [
        {
          commit: {
            committer: {
              date: "2023-04-27T17:50:53Z",
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
  }

});
