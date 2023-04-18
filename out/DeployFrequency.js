"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeployFrequency = void 0;
class DeployFrequency {
    constructor(dateString = null) {
        this.today = new Date();
        if (dateString !== null) {
            this.today = new Date(dateString);
        }
    }
    weekly(json) {
        var rels = JSON.parse(json);
        var releasecount = 0;
        rels.forEach(element => {
            var relDate = new Date(element.published_at);
            if (this.today.valueOf() - relDate.valueOf() < 0) {
                releasecount++;
            }
        });
        return releasecount;
    }
    monthly(releases) {
        return 0;
    }
}
exports.DeployFrequency = DeployFrequency;
//# sourceMappingURL=DeployFrequency.js.map