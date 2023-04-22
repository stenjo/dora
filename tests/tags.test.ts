import { tags } from '../src/tags';

test.skip('fetches tags', async () => {

    const tl = await tags(process.env['GH_TOKEN'], 'stenjo', 'dora');

    expect(tl.length).toBeGreaterThan(-1);
});
