// 
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

interface ReleaseList {
    releases: Array<ReleaseObj>;
}
export class DeployFrequency {
    today: Date = new Date();
    constructor(dateString: string|null = null) {
        if (dateString !== null) {
            this.today = new Date(dateString)
        }
    }
    weekly(json: any): number {
        var rels: ReleaseList = JSON.parse(json);
        var releasecount = 0;
        rels.releases.forEach(element => {
            var relDate = new Date(element.published_at)
            if (this.days_between(this.today, relDate) < 7) {
                releasecount++;
            }
        });

        return releasecount;
    }

    monthly(releases: any): number {
        return 0;
    }

    private days_between(date1: Date, date2: Date): number {

        // The number of milliseconds in one day
        const ONE_DAY = 1000 * 60 * 60 * 24;
    
        // Calculate the difference in milliseconds
        const differenceMs = Math.abs(date1.valueOf() - date2.valueOf());
    
        // Convert back to days and return
        return Math.round(differenceMs / ONE_DAY);
    
    }
}