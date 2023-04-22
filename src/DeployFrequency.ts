// 

import { ReleaseObj } from "./IReleaseList";

export class DeployFrequency {
    today: Date = new Date();
    rlist: Array<ReleaseObj> = new Array<ReleaseObj>();

    constructor(releases: Array<ReleaseObj>, dateString: string|null = null) {
        this.rlist = releases;
        if (dateString !== null) {
            this.today = new Date(dateString)
        }
    }



    weekly(): number {
        let releasecount = 0;
        this.rlist.forEach(element => {
            const relDate = new Date(element.published_at)
            if (this.days_between(this.today, relDate) < 8) {
                releasecount++;
            }
        });

        return releasecount;
    }

    monthly(): number {
        let releasecount = 0;
        this.rlist.forEach(element => {
            const relDate = new Date(element.published_at)
            if (this.days_between(this.today, relDate) < 31) {
                releasecount++;
            }
        });

        return releasecount;
    }

    rate(): string {
        return (Math.round(this.monthly() * 700) / 3000).toFixed(2);
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