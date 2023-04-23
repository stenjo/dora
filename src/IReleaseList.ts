import { Person } from "./IPerson";

export interface ReleaseObj {
    url: string;
    uploadUrl: string;
    id: number;
    author: Person;
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