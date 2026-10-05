import { test, expect } from '@fixtures';
import { products } from '@data/products';

test.describe('Cart', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('adding items updates badge and cart contents @smoke', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack.name, products.bikeLight.name);
    await expect(inventoryPage.cartBadge).toHaveText('2');

    await inventoryPage.openCart();
    await expect(cartPage.itemNames).toHaveText([products.backpack.name, products.bikeLight.name]);
  });

  test('add button toggles to remove and back', async ({ inventoryPage }) => {
    const { name } = products.onesie;
    await inventoryPage.addToCart(name);
    await expect(inventoryPage.removeButton(name)).toBeVisible();

    await inventoryPage.removeButton(name).click();
    await expect(inventoryPage.addToCartButton(name)).toBeVisible();
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('removing an item from the cart page', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack.name, products.fleeceJacket.name);
    await inventoryPage.openCart();
    await cartPage.remove(products.backpack.name);
    await expect(cartPage.itemNames).toHaveText([products.fleeceJacket.name]);
    await expect(cartPage.cartBadge).toHaveText('1');
  });

  test('cart persists across page reloads', async ({ page, inventoryPage }) => {
    await inventoryPage.addToCart(products.boltTShirt.name);
    await page.reload();
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });
});
