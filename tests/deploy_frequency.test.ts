// 
import { DeployFrequency } from '../src/DeployFrequency';
import fs from 'fs';
// import { releases as releaselist } from './test-data/one-release.json';

describe('Deploy frequency should', () => {
    var releaselist = fs.readFileSync('./tests/test-data/one-release.json', 'utf-8');
    it('calculate releases pr week for release less than 1 week', () => {
        let df = new DeployFrequency("2023-04-14T22:33:11Z");
        let wr = df.weekly(releaselist);

        expect(wr).toBe(1);
    })
    it('calculate releases pr week for release more than 1 week ago', () => {
        let df = new DeployFrequency("2023-04-24T22:33:11Z");
        let wr = df.weekly(releaselist);

        expect(wr).toBe(0);
    })
})
