import { Releases } from '../src/Releases';

test.skip('fetches releases', async () => {
  let r = new Releases();
  let tl = await r.list(process.env['GH_TOKEN'], 'stenjo', 'dora');
  expect(tl.length).toBeGreaterThan(0);
});
