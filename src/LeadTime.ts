import { CommitObject } from "./ICommit";
import { PullRequestObject } from "./IPullRequestObject";
import { ReleaseObject } from "./interfaces/IRelease";

const ONE_DAY = 24 * 60 * 60 * 1000;
export class LeadTime {
  pulls: PullRequestObject[];
  releases: number[];
  today: Date;
  getCommits: (pullNo: number) => Promise<CommitObject[]>;

  constructor(
    pulls: PullRequestObject[],
    releases: ReleaseObject[],
    getCommits: (pullNo: number) => Promise<CommitObject[]>,
    today: Date | null = null
  ) {
    if (today === null) {
      this.today = new Date();
    } else {
      this.today = today;
    }

    this.pulls = pulls.filter((p)=>+new Date(p.merged_at) > this.today.valueOf() - 31 * ONE_DAY);
    this.releases = releases.map((r)=>+new Date(r.published_at));
    this.getCommits = getCommits;
  }

  async getLeadTime(): Promise<number> {
    if (this.pulls.length === 0 || this.releases.length === 0) {
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
        const laterReleases = this.releases.filter((r)=>r > mergeTime);
        if (laterReleases.length === 0) {
          continue;
        }
        const deployTime = laterReleases[0];
        const commmmits = await this.getCommits(pull.number);
        const commitTime = commmmits
          .map((c) => +new Date(c.commit.committer.date))
          .sort()[0];
        leadTimes.push((deployTime - commitTime) / ONE_DAY);
      }
    }
    if (leadTimes.length === 0) {
        return 0;
    }

    return Math.round(leadTimes.reduce((p, c) => p + c) / leadTimes.length * 100) / 100;
  }
}
