const issues = require('./issues');

test('fetches issues', async () => {

    let il = await issues(process.env['GH_TOKEN'], 'stenjo', 'dora');

    expect(il.length).toBe(3);
});
