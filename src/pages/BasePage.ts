import { type Locator, type Page } from '@playwright/test';

export abstract class BasePage {
  abstract readonly path: string;
  readonly title: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(protected readonly page: Page) {
    this.title = page.getByTestId('title');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async cartCount(): Promise<number> {
    return (await this.cartBadge.isVisible()) ? Number(await this.cartBadge.textContent()) : 0;
  }
}
