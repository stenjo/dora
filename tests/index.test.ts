import * as process from 'process';
import * as cp from 'child_process';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

describe.skip('Deployrate weekly should', ()=>{
  test('read inputs when set', ()=>{
    process.env['INPUT_REPO'] = 'devops-metrics-action';
    process.env['INPUT_OWNER'] = 'stenjo';
    process.env['GITHUB_REPOSITORY'] = 'owner/repo';
  
    const ip: string = path.join(__dirname, '../src/index.ts');
    const result: string = cp.execSync(`npx ts-node ${ip}`, { env: process.env }).toString();
  
    expect(result).toContain('lead-time');
  
  });
  
  test('use default repo when no repo input ', ()=>{
    process.env['INPUT_REPO'] = 'Middager';
    process.env['INPUT_OWNER'] = 'stenjo';
    process.env['GITHUB_REPOSITORY'] = 'owner/repo';
    
      const ip: string = path.join(__dirname, '../src/index.ts');
      const result: string = cp.execSync(`npx ts-node ${ip}`, { env: process.env }).toString();
    
      expect(result).toContain('name=deploy-rate::0.00');
    
    });
});
