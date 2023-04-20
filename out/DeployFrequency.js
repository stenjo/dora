// 
export class DeployFrequency {
    constructor(dateString = null) {
        this.today = new Date();
        if (dateString !== null) {
            this.today = new Date(dateString);
        }
    }
    weekly(json) {
        var rels = JSON.parse(json);
        var releasecount = 0;
        rels.releases.forEach(element => {
            var relDate = new Date(element.published_at);
            if (this.days_between(this.today, relDate) < 7) {
                releasecount++;
            }
        });
        return releasecount;
    }
    monthly(releases) {
        return 0;
    }
    days_between(date1, date2) {
        // The number of milliseconds in one day
        const ONE_DAY = 1000 * 60 * 60 * 24;
        // Calculate the difference in milliseconds
        const differenceMs = Math.abs(date1.valueOf() - date2.valueOf());
        // Convert back to days and return
        return Math.round(differenceMs / ONE_DAY);
    }
}
//# sourceMappingURL=DeployFrequency.js.map