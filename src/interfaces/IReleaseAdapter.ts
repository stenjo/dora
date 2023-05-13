import { ReleaseObject } from "./IRelease";

export interface IReleaseAdapter {
    today: Date;
    GetAllReleasesLastMonth(): Promise<ReleaseObject[]|undefined>;
}