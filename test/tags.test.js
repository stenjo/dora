const tags = require('../src/tags');

test('fetches tags', async () => {

    let tl = await tags(process.env['GH_TOKEN'], 'stenjo', 'dora');

    expect(tl.length).toBeGreaterThan(-1);
});
