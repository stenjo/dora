// 
import { DeployFrequency } from '../src/DeployFrequency';
import fs from 'fs';
import { ReleaseObject } from '../src/IReleaseList';

describe('Deploy frequency should', () => {
    // Release v0.0.1:2023-04-14, v0.0.2:2023-04-22
    const releaselist:Array<ReleaseObject> = JSON.parse(fs.readFileSync('./tests/test-data/one-release.json', 'utf-8'));
    it('calculate releases pr week for release less than 1 week', () => {
        const df = new DeployFrequency(releaselist, "2023-04-14T22:33:11Z");
        const wr = df.weekly();

        expect(wr).toBe(1);
    })
    it('calculate releases pr week for release more than 1 week ago', () => {
        const df = new DeployFrequency(releaselist, "2023-04-24T22:33:11Z");
        const wr = df.weekly();

        expect(wr).toBe(1);
    })
    it('montly calculate releases pr week for release more than 1 week ago', () => {
        const df = new DeployFrequency(releaselist, "2023-04-24T22:33:11Z");
        const mr = df.monthly();

        expect(mr).toBe(2);
    })
    it('calculate release rate last month', () => {
        const df = new DeployFrequency(releaselist, "2023-04-14T22:33:11Z");
        const rr = df.rate();

        expect(rr).toBe('0.47');
    })
    it('calculate release rate next month', () => {
        const df = new DeployFrequency(releaselist, "2023-05-23T22:33:11Z");
        const rr = df.rate();

        expect(rr).toBe('0.00');
    })
    it("throw excepiton when no releases", ()=>{
        const emptyReleaseList : ReleaseObject[] = [];
    
        const t = () => {
          new DeployFrequency(emptyReleaseList);
        }
    
        expect(t).toThrow("Empty release list");
            
    })
})
