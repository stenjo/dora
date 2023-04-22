// @typescript-eslint/no-explicit-any
interface Author {
    login: string;
    id: number;
    node_id: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
}

interface ReleaseObj {
    url: string;
    uploadUrl: string;
    id: number;
    author: Author;
    node_id: string;
    tag_name: string;
    target_commitish: string;
    name: string;
    draft: boolean;
    prerelease: boolean;
    created_at: string;
    published_at: string;
    assets: Array<any>;
    tarball_url: string;
    zipball_url: string;
    body: string;
}

export interface ReleaseList {
    releases: Array<ReleaseObj>;
}