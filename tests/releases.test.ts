import { Releases } from '../src/Releases';
import { ReleaseObj } from '../src/IReleaseList';

test.skip('fetches releases', async () => {
  const r = new Releases();
  const tl: Array<ReleaseObj> = await r.list(process.env['GH_TOKEN'], 'stenjo', 'dora');

  expect(tl.length).toBeGreaterThan(0);
  expect(tl.length).toBe(1);
  expect(tl[0].author.type).toBe("Bot");
  expect(tl[0].name).toBe("v0.0.1");
});
