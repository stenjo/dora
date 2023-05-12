import { ReleaseAdapter } from '../src/ReleaseAdapter';
import { ReleaseObject } from '../src/interfaces/IRelease';

test('fetches releases', async () => {
  const r = new ReleaseAdapter(process.env['GH_TOKEN'], 'stenjo', 'dora');
  const tl: Array<ReleaseObject> = await r.GetAllReleasesLastMonth() as Array<ReleaseObject>;

  expect(tl.length).toBeGreaterThan(0);
  expect(tl[0].author.type).toBe("Bot");
  expect(tl.reverse()[0].name).toBe("v0.0.1");
});
