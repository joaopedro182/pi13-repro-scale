import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.BASE_URL || 'https://example.com';

test.describe('Novo teste via prd', () => {
  test('RF-01 — Página carrega com sucesso dentro do tempo limite', async ({ page }) => {
    const response = await page.goto(TARGET_URL, { waitUntil: 'load', timeout: 30000 });
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(400);
    await expect(page.locator('body')).toBeVisible();
  });

  test('RF-02 — Título da página é exatamente "Example Domain"', async ({ page }) => {
    await page.goto(TARGET_URL, { waitUntil: 'load', timeout: 30000 });
    await expect(page).toHaveTitle('Example Domain');
  });

  test('RF-03 — Conteúdo principal <h1> está visível com o texto "Example Domain"', async ({ page }) => {
    await page.goto(TARGET_URL, { waitUntil: 'load', timeout: 30000 });
    const heading = page.getByRole('heading', { level: 1, name: 'Example Domain' });
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText('Example Domain');
  });
});
