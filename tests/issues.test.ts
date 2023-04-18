import { issues } from '../src/issues';

test.skip('fetches issues', async () => {
  let il = await issues(process.env['GH_TOKEN'], 'stenjo', 'dora');
  expect(il?.length).toBeGreaterThan(0);
});
