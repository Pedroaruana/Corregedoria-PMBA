import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { api } from '@/services/api'

interface AuthUser {
  matricula: string
  nome: string
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (matricula: string, senha: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('coppm_user')
      if (stored) setUser(JSON.parse(stored))
    } catch {
      localStorage.removeItem('coppm_user')
      localStorage.removeItem('coppm_token')
    } finally {
      setLoading(false)
    }
  }, [])

  async function login(matricula: string, senha: string) {
    const data = await api.login(matricula, senha)
    localStorage.setItem('coppm_token', data.token)
    localStorage.setItem('coppm_user', JSON.stringify({ matricula: data.matricula, nome: data.nome }))
    setUser({ matricula: data.matricula, nome: data.nome })
  }

  function logout() {
    localStorage.removeItem('coppm_token')
    localStorage.removeItem('coppm_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth fora do AuthProvider')
  return ctx
}
