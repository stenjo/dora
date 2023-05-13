import { PullRequestObject } from "./IPullRequestObject";

export interface IPullRequestsAdapter {
  GetAllPRsLastMonth():  Promise<PullRequestObject[]|undefined>;  
}