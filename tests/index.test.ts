import { wait } from '../src/wait';
import * as process from 'process';
import * as cp from 'child_process';
import * as path from 'path';

test('throws invalid number', async () => {
  await expect(wait('foo')).rejects.toThrow('milliseconds not a number');
});

test('wait 500 ms', async () => {
  const start: Date = new Date();
  await wait(500);
  const end: Date = new Date();
  const delta: number = Math.abs(end.valueOf() - start.valueOf());
  expect(delta).toBeGreaterThanOrEqual(500);
});

// shows how the runner will run a javascript action with env / stdout protocol
test.skip('test runs', () => {
  process.env['INPUT_MILLISECONDS'] = '100';
  const ip: string = path.join(__dirname, '../src/index.ts');
  const result: string = cp.execSync(`npx ts-node ${ip}`, { env: process.env }).toString();
  console.log(result);
});

describe('Deployrate weekly should', ()=>{
  test('read inputs when set', ()=>{
    process.env['INPUT_REPO'] = 'repository';
    process.env['GITHUB_REPOSITORY'] = 'owner/repo';
  
    const ip: string = path.join(__dirname, '../src/index.ts');
    const result: string = cp.execSync(`npx ts-node ${ip}`, { env: process.env }).toString();
  
    expect(result).toContain('repository');
  
  });
  
  test('use default repo when no repo input ', ()=>{
    process.env['INPUT_REPO'] = '';
    process.env['GITHUB_REPOSITORY'] = 'owner/repo';
    
      const ip: string = path.join(__dirname, '../src/index.ts');
      const result: string = cp.execSync(`npx ts-node ${ip}`, { env: process.env }).toString();
    
      expect(result).toContain('repo');
    
    });
});
