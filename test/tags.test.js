const tags = require('../src/tags');

test('fetches tags', async () => {

    let il = await tags(process.env['GH_TOKEN'], 'stenjo', 'dora');

    expect(il.length).toBeGreaterThan(0);
});
