import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.route('**/auth/login', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        token: 'fake-token-test',
        matricula: '123456',
        nome: 'Policial 123456',
      }),
    })
  })
})

test('login page renders correctly', async ({ page }) => {
  await page.goto('/login')

  await expect(page.getByText('Polícia Militar da Bahia')).toBeVisible()
  await expect(page.getByText('Corregedoria — COPPM/BA')).toBeVisible()
  await expect(page.getByPlaceholder('Ex: 123456')).toBeVisible()
  await expect(page.getByPlaceholder('••••••••')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible()
})

test('any credentials redirect to dashboard', async ({ page }) => {
  await page.goto('/login')

  await page.getByPlaceholder('Ex: 123456').fill('123456')
  await page.getByPlaceholder('••••••••').fill('qualquer')
  await page.getByRole('button', { name: 'Entrar' }).click()

  await expect(page).toHaveURL('/dashboard')
})

test('shows error when fields are empty', async ({ page }) => {
  await page.goto('/login')

  await page.getByRole('button', { name: 'Entrar' }).click()

  await expect(page.getByText('Preencha a matrícula e a senha.')).toBeVisible()
})

test('unauthenticated user is redirected to login', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL('/login')
})
