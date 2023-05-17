import {Commit} from './Commit'

export interface ICommitsAdapter {
  getCommitsFromUrl(url: string): Promise<Commit[] | undefined>
}
