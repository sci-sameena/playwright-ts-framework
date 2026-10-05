/** "Sauce Labs Backpack" -> "sauce-labs-backpack" (matches the app's data-test ids) */
export const toSlug = (name: string): string =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/** "$29.99" or "Item total: $29.99" -> 29.99 */
export const parsePrice = (text: string): number => {
  const match = text.match(/\$(\d+(?:\.\d+)?)/);
  if (!match) throw new Error(`No price found in "${text}"`);
  return Number(match[1]);
};

export const roundMoney = (n: number): number => Math.round(n * 100) / 100;
