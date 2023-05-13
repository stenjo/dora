import {PullRequest} from './interfaces/PullRequest'

export interface IPullRequestsAdapter {
  GetAllPRsLastMonth(): Promise<PullRequest[] | undefined>
}
