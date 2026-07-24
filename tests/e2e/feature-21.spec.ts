import { test, expect } from '@playwright/test';

test.describe('Feature 21', () => {
  test('carrega a página 21 corretamente', async ({ page }) => {
    await page.goto(process.env.BASE_URL || 'https://example.com');
    await expect(page).toHaveTitle(/Example Domain/);
  });

  test('teste 21 com falha proposital', async ({ page }) => {
    await page.goto(process.env.BASE_URL || 'https://example.com');
    await expect(page.locator('h1')).toHaveText('Nunca vai bater — feature 21');
  });
});
