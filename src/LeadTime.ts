import { CommitObject } from "./ICommitsList";
import { PullRequestObject } from "./IPullRequest";

const ONE_DAY = 24 * 60 * 60 * 1000;
export class LeadTime {
  pulls: PullRequestObject[];
  today: Date;
  getCommits: (pullNo: number) => Promise<CommitObject[]>;

  constructor(
    pulls: PullRequestObject[],
    getCommits: (pullNo: number) => Promise<CommitObject[]>,
    today: Date | null = null
  ) {
    if (today === null) {
      this.today = new Date();
    } else {
      this.today = today;
    }

    this.pulls = pulls.filter((p)=>+new Date(p.merged_at) > this.today.valueOf() - 31 * ONE_DAY);
    this.getCommits = getCommits;
  }

  async getLeadTime(): Promise<number> {
    if (this.pulls.length === 0) {
      return 0;
    }
    const leadTimes: number[] = [];
    for (let i = 0; i < this.pulls.length; i++) {
      const pull = this.pulls[i];
      if (
        typeof pull.merged_at === "string" &&
        pull.merged_at &&
        pull.base.ref === "main"
      ) {
        const mergeTime = +new Date(pull.merged_at);
        const commmmits = await this.getCommits(pull.number);
        const commitTime = commmmits
          .map((c) => +new Date(c.commit.committer.date))
          .sort()[0];
        leadTimes.push((mergeTime - commitTime) / ONE_DAY);
      }
    }
    if (leadTimes.length === 0) {
        return 0;
    }

    return leadTimes.reduce((p, c) => p + c) / leadTimes.length;
  }
}
