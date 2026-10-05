import { test as setup, expect } from '@fixtures';
import { users } from '@data/users';
import { AUTH_FILE } from '../../playwright.config';

// Logs in once via the UI and saves the session; all other tests reuse it.
// This keeps suites fast and isolates login coverage to tests/auth.
setup('authenticate as standard user', async ({ page, loginPage }) => {
  await loginPage.goto();
  await loginPage.login(users.standard);
  await expect(page).toHaveURL(/inventory\.html/);
  await page.context().storageState({ path: AUTH_FILE });
});
