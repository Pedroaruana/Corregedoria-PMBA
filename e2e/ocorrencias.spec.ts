import { test, expect } from '@playwright/test'

const mockOcorrencias = [
  {
    id: 'cuid1',
    protocolo: 'AR-2026/0342',
    dataFato: '2026-03-14',
    horaFato: '23:47',
    bpm: '18º BPM',
    municipio: 'Salvador',
    bairro: 'Periperi',
    logradouro: 'Rua das Flores, 120',
    narrativa: 'Guarnição em patrulhamento avistou indivíduo em atitude suspeita.',
    vitimasFatais: 1,
    feridos: 0,
    status: 'Concluída',
    tipoArma: 'Pistola',
    calibre: '9mm',
    disparos: 3,
    armaApreendida: true,
    policiais: [{ nome: 'Pedro Aruana', patente: 'Sd', matricula: '123456', bpm: '18º BPM' }],
    assinadoPor: '123456',
    assinadoEm: '2026-03-15T10:22:00.000Z',
    createdAt: '2026-03-14T23:47:00.000Z',
    updatedAt: '2026-03-15T10:22:00.000Z',
  },
]

test.beforeEach(async ({ page }) => {
  await page.route('**/auth/login', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token: 'fake-token', matricula: '123456', nome: 'Policial 123456' }),
    })
  })

  await page.route(/localhost:3333\/ocorrencias\//, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockOcorrencias[0]),
    })
  })

  await page.route(/localhost:3333\/ocorrencias$/, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockOcorrencias),
    })
  })

  await page.goto('/login')
  await page.getByPlaceholder('Ex: 123456').fill('123456')
  await page.getByPlaceholder('••••••••').fill('qualquer')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL('/dashboard')
})

test('shows ocorrencias list', async ({ page }) => {
  await page.goto('/ocorrencias')

  await expect(page.getByText('AR-2026/0342')).toBeVisible()
  await expect(page.getByText('18º BPM')).toBeVisible()
  await expect(page.getByText('Periperi')).toBeVisible()
})

test('search filters the list', async ({ page }) => {
  await page.goto('/ocorrencias')
  await expect(page.getByText('AR-2026/0342')).toBeVisible()

  await page.getByPlaceholder('Buscar por protocolo, local ou policial...').fill('naoexiste')
  await expect(page.getByText('Nenhuma ocorrência encontrada')).toBeVisible()
})

test('navigates to occurrence details', async ({ page }) => {
  await page.goto('/ocorrencias')
  await expect(page.getByText('AR-2026/0342')).toBeVisible()

  await page.getByRole('button', { name: 'Ver →' }).first().click()
  await expect(page.getByText('Narrativa dos fatos')).toBeVisible()
})
