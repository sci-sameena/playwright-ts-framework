import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { parsePrice, toSlug } from '@utils/format';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage extends BasePage {
  readonly path = '/inventory.html';
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly sortSelect: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.sortSelect = page.getByTestId('product-sort-container');
  }

  addToCartButton(productName: string): Locator {
    return this.page.getByTestId(`add-to-cart-${toSlug(productName)}`);
  }

  removeButton(productName: string): Locator {
    return this.page.getByTestId(`remove-${toSlug(productName)}`);
  }

  async addToCart(...productNames: string[]): Promise<void> {
    for (const name of productNames) await this.addToCartButton(name).click();
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortSelect.selectOption(option);
  }

  async names(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async prices(): Promise<number[]> {
    return (await this.itemPrices.allTextContents()).map(parsePrice);
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
