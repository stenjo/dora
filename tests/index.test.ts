import * as process from 'process';
import * as cp from 'child_process';
import * as path from 'path';


describe.skip('Deployrate weekly should', ()=>{
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
