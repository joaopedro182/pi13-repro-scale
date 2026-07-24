import { test, expect } from '@playwright/test';

test.describe('Autenticação', () => {
  test('exibe a tela inicial', async ({ page }) => {
    await page.goto(process.env.BASE_URL || 'https://example.com');
    await expect(page).toHaveTitle(/Example Domain/);
  });
});
