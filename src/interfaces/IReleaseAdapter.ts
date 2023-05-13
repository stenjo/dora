import {Release} from './Release'

export interface IReleaseAdapter {
  today: Date
  GetAllReleasesLastMonth(): Promise<Release[] | undefined>
}
