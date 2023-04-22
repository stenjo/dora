// 

import { ReleaseList } from "./IReleaseList";

export class DeployFrequency {
    today: Date = new Date();
    constructor(dateString: string|null = null) {
        if (dateString !== null) {
            this.today = new Date(dateString)
        }
    }
    weekly(json: any): number {
        const rels: ReleaseList = JSON.parse(json);
        let releasecount = 0;
        rels.releases.forEach(element => {
            const relDate = new Date(element.published_at)
            if (this.days_between(this.today, relDate) < 8) {
                releasecount++;
            }
        });

        return releasecount;
    }

    monthly(json: any): number {
        const rels: ReleaseList = JSON.parse(json);
        let releasecount = 0;
        rels.releases.forEach(element => {
            const relDate = new Date(element.published_at)
            if (this.days_between(this.today, relDate) < 31) {
                releasecount++;
            }
        });

        return releasecount;
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