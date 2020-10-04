import { login, getPageUrl } from '../../../../../../../tests/helpers/e2e';

fixture('/login').page('http://localhost:3000/login');

test('should allow member to login', async (browser) => {
  await login({
    email: 'member1@member.com',
    password: 'password',
    browser,
  });

  await browser.expect(getPageUrl()).contains('/');
});
