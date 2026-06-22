import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api } from '@/services/api'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

function mockResponse(data: unknown, ok = true) {
  return Promise.resolve({
    ok,
    json: () => Promise.resolve(data),
  })
}

beforeEach(() => {
  mockFetch.mockReset()
  localStorage.clear()
})

describe('api.login', () => {
  it('should call /auth/login with matricula and senha', async () => {
    mockFetch.mockReturnValueOnce(
      mockResponse({ token: 'abc123', matricula: '111', nome: 'Policial 111' })
    )

    const result = await api.login('111', 'qualquer')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      expect.objectContaining({ method: 'POST' })
    )
    expect(result.token).toBe('abc123')
    expect(result.matricula).toBe('111')
  })

  it('should throw when server returns an error', async () => {
    mockFetch.mockReturnValueOnce(
      mockResponse({ error: 'Matrícula e senha são obrigatórios' }, false)
    )

    await expect(api.login('', '')).rejects.toThrow('Matrícula e senha são obrigatórios')
  })
})

describe('api.getOcorrencias', () => {
  it('should include Authorization header when token exists', async () => {
    localStorage.setItem('coppm_token', 'token-teste')
    mockFetch.mockReturnValueOnce(mockResponse([]))

    await api.getOcorrencias()

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/ocorrencias'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer token-teste',
        }),
      })
    )
  })

  it('should return a list of ocorrencias', async () => {
    localStorage.setItem('coppm_token', 'token-teste')
    const mockData = [{ protocolo: 'AR-2026/0001', status: 'Registrada' }]
    mockFetch.mockReturnValueOnce(mockResponse(mockData))

    const result = await api.getOcorrencias()
    expect(result).toHaveLength(1)
    expect(result[0].protocolo).toBe('AR-2026/0001')
  })
})

describe('api.assinarTermo', () => {
  it('should call PATCH with matricula in the body', async () => {
    localStorage.setItem('coppm_token', 'token-teste')
    mockFetch.mockReturnValueOnce(mockResponse({ status: 'Concluída' }))

    await api.assinarTermo('AR-2026/0342', '123456')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('AR-2026%2F0342'),
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ matricula: '123456' }),
      })
    )
  })
})
