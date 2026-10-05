import { test, expect } from '@fixtures';
import { users } from '@data/users';

// Start these tests logged out, overriding the project-level storage state.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user can log in @smoke', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(users.standard);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  const negativeCases = [
    { name: 'locked out user', user: users.lockedOut, message: /locked out/i },
    { name: 'invalid credentials', user: users.invalid, message: /do not match/i },
    { name: 'empty username', user: { username: '', password: 'x' }, message: /username is required/i },
    { name: 'empty password', user: { username: 'standard_user', password: '' }, message: /password is required/i },
  ];

  for (const { name, user, message } of negativeCases) {
    test(`shows error for ${name}`, async ({ page, loginPage }) => {
      await loginPage.login(user);
      await expect(loginPage.error).toHaveText(message);
      await expect(page).not.toHaveURL(/inventory\.html/);
    });
  }

  test('protected pages redirect to login when unauthenticated', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');
    await expect(loginPage.error).toContainText(/only access .*inventory.* when you are logged in/i);
  });
});
