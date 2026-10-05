import { test, expect } from '@fixtures';
import { type SortOption } from '@pages/InventoryPage';

test.describe('Inventory sorting', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('shows all 6 products', async ({ inventoryPage }) => {
    await expect(inventoryPage.items).toHaveCount(6);
  });

  const nameSorts: { option: SortOption; compare: (a: string, b: string) => number }[] = [
    { option: 'az', compare: (a, b) => a.localeCompare(b) },
    { option: 'za', compare: (a, b) => b.localeCompare(a) },
  ];
  for (const { option, compare } of nameSorts) {
    test(`sorts names: ${option}`, async ({ inventoryPage }) => {
      await inventoryPage.sortBy(option);
      const names = await inventoryPage.names();
      expect(names).toEqual([...names].sort(compare));
    });
  }

  const priceSorts: { option: SortOption; compare: (a: number, b: number) => number }[] = [
    { option: 'lohi', compare: (a, b) => a - b },
    { option: 'hilo', compare: (a, b) => b - a },
  ];
  for (const { option, compare } of priceSorts) {
    test(`sorts prices: ${option} @smoke`, async ({ inventoryPage }) => {
      await inventoryPage.sortBy(option);
      const prices = await inventoryPage.prices();
      expect(prices).toEqual([...prices].sort(compare));
    });
  }
});
