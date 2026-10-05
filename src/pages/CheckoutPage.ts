import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { type CustomerInfo } from '@data/factories';
import { parsePrice } from '@utils/format';

/** Covers the 3-step checkout flow: info -> overview -> complete. */
export class CheckoutPage extends BasePage {
  readonly path = '/checkout-step-one.html';
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly error: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.finishButton = page.getByTestId('finish');
    this.error = page.getByTestId('error');
    this.subtotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.completeHeader = page.getByTestId('complete-header');
  }

  async fillInfo(info: Partial<CustomerInfo>): Promise<void> {
    if (info.firstName !== undefined) await this.firstName.fill(info.firstName);
    if (info.lastName !== undefined) await this.lastName.fill(info.lastName);
    if (info.postalCode !== undefined) await this.postalCode.fill(info.postalCode);
    await this.continueButton.click();
  }

  async totals(): Promise<{ subtotal: number; tax: number; total: number }> {
    return {
      subtotal: parsePrice(await this.subtotal.innerText()),
      tax: parsePrice(await this.tax.innerText()),
      total: parsePrice(await this.total.innerText()),
    };
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
