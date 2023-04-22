import { Releases } from '../src/Releases';

test.skip('fetches releases', async () => {
  const r = new Releases();
  const tl = await r.list(process.env['GH_TOKEN'], 'stenjo', 'dora');
  expect(tl.length).toBeGreaterThan(0);
});
