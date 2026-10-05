import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { toSlug } from '@utils/format';

export class CartPage extends BasePage {
  readonly path = '/cart.html';
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;
  readonly continueShopping: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShopping = page.getByTestId('continue-shopping');
  }

  async remove(productName: string): Promise<void> {
    await this.page.getByTestId(`remove-${toSlug(productName)}`).click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
