import { test, expect } from '@playwright/test';

const BASE_URL = (process.env.BASE_URL ?? '').replace(/\/$/, '');

test.describe('Smoke Test — API', () => {
  test('deve responder ao health check com status 200', async ({ page }) => {
    const response = await page.goto(BASE_URL + '/', { waitUntil: 'load', timeout: 30000 });
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(400);
    await expect(page.locator('body')).toBeVisible();
  });
});
