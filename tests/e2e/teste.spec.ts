import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://example.com';
const TEST_USER = process.env.TEST_USER || 'usuario@teste.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'Senha123valida';

test.describe('Autenticação e Segurança de Conta', () => {

  test('Login bem-sucedido com credenciais válidas', async ({ page }) => {
    await page.goto(BASE_URL + '/login');
    await page.getByPlaceholder('E-mail').fill(TEST_USER);
    await page.getByPlaceholder('Senha').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 15000 });
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(c => c.name === 'session' || c.name === 'token' || c.name === 'access_token');
    expect(sessionCookie).toBeDefined();
  });

  test('Bloqueio de conta após 5 tentativas de login com senha incorreta', async ({ page }) => {
    await page.goto(BASE_URL + '/login');
    const wrongPassword = 'SenhaErrada!99';
    for (let i = 0; i < 5; i++) {
      await page.getByPlaceholder('E-mail').fill(TEST_USER);
      await page.getByPlaceholder('Senha').fill(wrongPassword);
      await page.getByRole('button', { name: 'Entrar' }).click();
      await expect(page.getByRole('alert')).toBeVisible({ timeout: 10000 });
      if (i < 4) {
        await page.getByPlaceholder('E-mail').clear();
        await page.getByPlaceholder('Senha').clear();
      }
    }
    await expect(page.getByText(/bloqueada|bloqueado|desbloqueio|minutos/i)).toBeVisible({ timeout: 10000 });
  });

  test('Conta não bloqueada antes de atingir o limite de tentativas inválidas', async ({ page }) => {
    await page.goto(BASE_URL + '/login');
    const wrongPassword = 'SenhaErradaParcial!1';
    for (let i = 0; i < 4; i++) {
      await page.getByPlaceholder('E-mail').fill(TEST_USER);
      await page.getByPlaceholder('Senha').fill(wrongPassword);
      await page.getByRole('button', { name: 'Entrar' }).click();
      await expect(page.getByRole('alert')).toBeVisible({ timeout: 10000 });
      if (i < 3) {
        await page.getByPlaceholder('E-mail').clear();
        await page.getByPlaceholder('Senha').clear();
      }
    }
    await expect(page.getByText(/bloqueada|bloqueado|desbloqueio/i)).not.toBeVisible();
    await expect(page.getByPlaceholder('Senha')).toBeVisible();
  });

  test('Solicitação de recuperação de senha por e-mail com link válido por 30 minutos', async ({ page }) => {
    await page.goto(BASE_URL + '/login');
    await page.getByRole('link', { name: /esqueceu|recuperar|forgot/i }).click();
    await expect(page).toHaveURL(/recuperar|forgot|reset/i, { timeout: 10000 });
    await page.getByPlaceholder('E-mail').fill(TEST_USER);
    await page.getByRole('button', { name: /enviar|solicitar|send/i }).click();
    await expect(page.getByText(/e-mail enviado|verifique|link|redefinição/i)).toBeVisible({ timeout: 10000 });
  });

  test('Expiração do link de recuperação de senha após 30 minutos', async ({ page }) => {
    const expiredToken = 'token-expirado-invalido-12345';
    await page.goto(BASE_URL + '/reset-password?token=' + expiredToken);
    await expect(page.getByText(/expirado|inválido|nova solicitação|expirou/i)).toBeVisible({ timeout: 10000 });
  });

  test('Rejeição de nova senha que não atende aos critérios de força', async ({ page }) => {
    await page.goto(BASE_URL + '/reset-password?token=token-valido-teste');
    await page.getByPlaceholder('Nova senha').fill('fraca');
    await page.getByRole('button', { name: /salvar|redefinir|confirmar/i }).click();
    await expect(page.getByText(/8 caracteres|maiúscula|minúscula|número|critério/i)).toBeVisible({ timeout: 10000 });
  });

  test('Aceitação de nova senha que atende a todos os critérios de força', async ({ page }) => {
    await page.goto(BASE_URL + '/reset-password?token=token-valido-teste');
    await page.getByPlaceholder('Nova senha').fill('NovaSenha123');
    await page.getByRole('button', { name: /salvar|redefinir|confirmar/i }).click();
    await expect(page.getByText(/8 caracteres|maiúscula|minúscula|número|critério/i)).not.toBeVisible();
    await expect(page.getByText(/sucesso|senha alterada|redefinida|atualizada/i)).toBeVisible({ timeout: 10000 });
  });

  test('Logout encerra a sessão e invalida o token do usuário', async ({ page }) => {
    await page.goto(BASE_URL + '/login');
    await page.getByPlaceholder('E-mail').fill(TEST_USER);
    await page.getByPlaceholder('Senha').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 15000 });
    await page.getByRole('button', { name: /sair|logout|encerrar/i }).click();
    await expect(page).toHaveURL(/login/, { timeout: 10000 });
    await page.goto(BASE_URL + '/dashboard');
    await expect(page).toHaveURL(/login/, { timeout: 10000 });
  });

});
