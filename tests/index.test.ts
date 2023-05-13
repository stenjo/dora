import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config()

describe.skip('Deployrate weekly should', () => {
  test('read inputs when set', () => {
    process.env['INPUT_REPO'] = 'Middager \n devops-metrics-action'
    process.env['INPUT_OWNER'] = 'stenjo'
    process.env['GITHUB_REPOSITORY'] = 'owner/repo'

    const ip: string = path.join(__dirname, '../src/index.ts')
    const result: string = cp
      .execSync(`npx ts-node ${ip}`, {env: process.env})
      .toString()

    expect(result).toContain('2 repositor(y|ies) registered.')
  })

  test('use default repo when no repo input ', () => {
    process.env['INPUT_REPO'] = '[Middager, dora]'
    process.env['INPUT_OWNER'] = 'stenjo'
    process.env['GITHUB_REPOSITORY'] = 'owner/repo'

    // const ip: string = path.join(__dirname, '../src/index.ts');

    const np = process.execPath
    const ip = path.join(__dirname, '..', 'out', 'index.js')
    const options: cp.ExecFileSyncOptions = {
      env: process.env
    }

    const result: string = cp.execFileSync(np, [ip], options).toString()

    expect(result).toContain('stenjo/Middager')
    expect(result).toContain('stenjo/dora')
    // console.log(cp.execFileSync(np, [ip], options).toString())
  })
})
