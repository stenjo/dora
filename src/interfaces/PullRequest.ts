export interface PullRequest {
  id: number
  number: number
  merged_at: string
  base: {
    ref: string
  }
}
