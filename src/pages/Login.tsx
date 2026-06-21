import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import brasao from '@/assets/PMBA.png'
import { useAuth } from '@/contexts/AuthContext'

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [matricula, setMatricula] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!matricula || !senha) {
      setErro('Preencha a matrícula e a senha.')
      return
    }
    setErro('')
    setLoading(true)
    try {
      await login(matricula, senha)
      navigate('/dashboard')
    } catch {
      setErro('Erro ao conectar ao servidor. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      <img
        src={brasao}
        alt=""
        className="absolute opacity-5 w-[600px] pointer-events-none select-none"
      />

      <div className="relative z-10 bg-white/95 rounded-lg shadow-2xl w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <img src={brasao} alt="Brasão PMBA" className="w-20 h-20 mx-auto mb-4 object-contain" />
          <h1 className="text-base font-bold text-gray-900 uppercase tracking-wide">
            Polícia Militar da Bahia
          </h1>
          <p className="text-xs text-gray-500 mt-1">Corregedoria — COPPM/BA</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Matrícula
            </label>
            <input
              type="text"
              placeholder="Ex: 123456"
              value={matricula}
              onChange={e => setMatricula(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>
          {erro && <p className="text-xs text-red-600">{erro}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-2 rounded-md text-sm font-semibold hover:bg-black transition-colors mt-2 disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-6">
          Qualquer matrícula e senha são aceitos para acesso ao sistema.
        </p>
      </div>
    </div>
  )
}
