
export interface PullRequestObject {
    id: number;
    number: number;
    merged_at: string;
    base: {
        ref: string;
    }
}