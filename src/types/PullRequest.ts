export interface PullRequest {
  id: number
  number: number
  merged_at: string
  commits_url: string
  base: {
    ref: string
  }
}
