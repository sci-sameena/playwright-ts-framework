import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@fixtures';

/**
 * Fails on NEW serious/critical WCAG violations. Known issues live in the
 * allowlist with a ticket reference, so the suite stays green while the
 * debt stays visible. Full scan results are attached to the report.
 */
const KNOWN_ISSUES: Record<string, string> = {
  // 'rule-id': 'JIRA-123 description',
};

const pages = [
  { name: 'inventory', path: '/inventory.html' },
  { name: 'cart', path: '/cart.html' },
];

for (const { name, path } of pages) {
  test(`${name} page has no new serious a11y violations`, async ({ page }, testInfo) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    await testInfo.attach('axe-results', {
      body: JSON.stringify(results.violations, null, 2),
      contentType: 'application/json',
    });

    const newViolations = results.violations
      .filter((v) => v.impact === 'serious' || v.impact === 'critical')
      .filter((v) => !(v.id in KNOWN_ISSUES))
      .map((v) => `${v.id} (${v.impact}): ${v.help}`);

    expect(newViolations, 'New accessibility violations found').toEqual([]);
  });
}
