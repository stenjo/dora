import {Issue} from './Issue'

export interface IIssuesAdapter {
  today: Date
  GetAllIssuesLastMonth(): Promise<Issue[] | undefined>
}
