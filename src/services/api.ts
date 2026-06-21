const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333'

function getToken() {
  return localStorage.getItem('coppm_token')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erro desconhecido' }))
    throw new Error(err.error ?? 'Erro na requisição')
  }
  return res.json()
}

export const api = {
  login: (matricula: string, senha: string) =>
    request<{ token: string; matricula: string; nome: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ matricula, senha }),
    }),

  getOcorrencias: () => request<OcorrenciaAPI[]>('/ocorrencias'),

  getOcorrencia: (protocolo: string) =>
    request<OcorrenciaAPI>(`/ocorrencias/${encodeURIComponent(protocolo)}`),

  criarOcorrencia: (data: Omit<OcorrenciaAPI, 'id' | 'createdAt' | 'updatedAt' | 'assinadoPor' | 'assinadoEm'>) =>
    request<OcorrenciaAPI>('/ocorrencias', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  assinarTermo: (protocolo: string, matricula: string) =>
    request<OcorrenciaAPI>(`/ocorrencias/${encodeURIComponent(protocolo)}/assinar`, {
      method: 'PATCH',
      body: JSON.stringify({ matricula }),
    }),
}

export interface OcorrenciaAPI {
  id: string
  protocolo: string
  dataFato: string
  horaFato: string
  bpm: string
  municipio: string
  bairro: string
  logradouro: string
  narrativa: string
  vitimasFatais: number
  feridos: number
  status: string
  tipoArma: string
  calibre: string
  disparos: number
  armaApreendida: boolean
  policiais: Array<{ nome: string; patente: string; matricula: string; bpm: string }>
  assinadoPor?: string | null
  assinadoEm?: string | null
  createdAt: string
  updatedAt: string
}
