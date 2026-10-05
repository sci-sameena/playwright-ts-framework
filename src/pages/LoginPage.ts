import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { type User } from '@data/users';

export class LoginPage extends BasePage {
  readonly path = '/';
  readonly username: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    super(page);
    this.username = page.getByTestId('username');
    this.password = page.getByTestId('password');
    this.submit = page.getByTestId('login-button');
    this.error = page.getByTestId('error');
  }

  async login(user: User): Promise<void> {
    await this.username.fill(user.username);
    await this.password.fill(user.password);
    await this.submit.click();
  }
}
