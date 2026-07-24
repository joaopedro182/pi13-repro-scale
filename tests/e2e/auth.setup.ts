import { test as setup } from '@playwright/test';

setup('autenticar via API e salvar estado', async ({ page }) => {
  await page.goto(process.env.BASE_URL || 'https://example.com');
  // simula "salvar sessão" sem storageState real, só pra reproduzir a estrutura
});
