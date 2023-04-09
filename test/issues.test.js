const issues = require('../src/issues');

test('fetches issues', async () => {

    let il = await issues(process.env['GH_TOKEN'], 'stenjo', 'dora');

    expect(il.length).toBeGreaterThan(3);
});
