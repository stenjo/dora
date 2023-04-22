// 
import { DeployFrequency } from '../src/DeployFrequency';
import fs from 'fs';
import { ReleaseObj } from '../src/IReleaseList';

describe('Deploy frequency should', () => {
    // Release v0.0.1:2023-04-14
    const releaselist:Array<ReleaseObj> = JSON.parse(fs.readFileSync('./tests/test-data/one-release.json', 'utf-8'));
    it('calculate releases pr week for release less than 1 week', () => {
        const df = new DeployFrequency(releaselist, "2023-04-14T22:33:11Z");
        const wr = df.weekly();

        expect(wr).toBe(1);
    })
    it('calculate releases pr week for release more than 1 week ago', () => {
        const df = new DeployFrequency(releaselist, "2023-04-24T22:33:11Z");
        const wr = df.weekly();

        expect(wr).toBe(0);
    })
    it('montly calculate releases pr week for release more than 1 week ago', () => {
        const df = new DeployFrequency(releaselist, "2023-04-24T22:33:11Z");
        const mr = df.monthly();

        expect(mr).toBe(1);
    })
    it('calculate release rate last month', () => {
        const df = new DeployFrequency(releaselist, "2023-04-14T22:33:11Z");
        const rr = df.rate();

        expect(rr).toBe('0.23');
    })
    it('calculate release rate last month', () => {
        const df = new DeployFrequency(releaselist, "2023-05-14T22:33:11Z");
        const rr = df.rate();

        expect(rr).toBe('0.00');
    })
})
