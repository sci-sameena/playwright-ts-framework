import { test, expect } from '@fixtures';
import { products, type Product } from '@data/products';
import { buildCustomer } from '@data/factories';
import { roundMoney } from '@utils/format';
import { type InventoryPage } from '@pages/InventoryPage';
import { type CartPage } from '@pages/CartPage';

test.describe('Checkout', () => {
  async function startCheckoutWith(
    items: Product[],
    { inventoryPage, cartPage }: { inventoryPage: InventoryPage; cartPage: CartPage },
  ) {
    await inventoryPage.goto();
    await inventoryPage.addToCart(...items.map((p) => p.name));
    await inventoryPage.openCart();
    await cartPage.checkout();
  }

  test('completes an order end to end @smoke', async ({ page, inventoryPage, cartPage, checkoutPage }) => {
    await startCheckoutWith([products.backpack], { inventoryPage, cartPage });

    await test.step('enter customer info', async () => {
      await checkoutPage.fillInfo(buildCustomer());
      await expect(page).toHaveURL(/checkout-step-two/);
    });

    await test.step('place order', async () => {
      await checkoutPage.finish();
      await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
      await expect(checkoutPage.cartBadge).toBeHidden();
    });
  });

  test('order totals are calculated correctly', async ({ inventoryPage, cartPage, checkoutPage }) => {
    const items = [products.backpack, products.bikeLight, products.onesie];
    await startCheckoutWith(items, { inventoryPage, cartPage });
    await checkoutPage.fillInfo(buildCustomer());

    const { subtotal, tax, total } = await checkoutPage.totals();
    const expectedSubtotal = roundMoney(items.reduce((sum, p) => sum + p.price, 0));

    expect(subtotal).toBe(expectedSubtotal);
    expect(total).toBe(roundMoney(subtotal + tax));
  });

  const requiredFields = [
    { field: 'firstName', message: /first name is required/i },
    { field: 'lastName', message: /last name is required/i },
    { field: 'postalCode', message: /postal code is required/i },
  ] as const;

  for (const { field, message } of requiredFields) {
    test(`validates required field: ${field}`, async ({ inventoryPage, cartPage, checkoutPage }) => {
      await startCheckoutWith([products.onesie], { inventoryPage, cartPage });
      await checkoutPage.fillInfo(buildCustomer({ [field]: '' }));
      await expect(checkoutPage.error).toHaveText(message);
    });
  }
});
