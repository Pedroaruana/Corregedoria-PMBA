import { useNavigate } from 'react-router-dom'
import brasao from '@/assets/PMBA.png'
import { useAuth } from '@/contexts/AuthContext'

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const patente = user?.nome?.split(' ')[0] ?? 'Sd.'
  const nome = user?.nome?.split(' ').slice(1).join(' ') ?? ''

  return (
    <header className="bg-black text-white">
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10">
        <div className="flex items-center gap-4">
          <img src={brasao} alt="Brasão PMBA" className="w-12 h-12 object-contain" />
          <div>
            <p className="text-sm font-bold uppercase tracking-widest">Polícia Militar da Bahia</p>
            <p className="text-xs text-gray-400">Corregedoria — COPPM/BA</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold uppercase tracking-widest">Sistema de Ocorrências</p>
          <p className="text-xs text-gray-400">Registro de Autos de Resistência</p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-6 px-6 py-2 text-xs text-gray-400">
        <span>{patente} {nome}</span>
        <span className="bg-white/10 px-2 py-0.5 rounded text-white font-semibold uppercase">
          {patente}
        </span>
        <button onClick={handleLogout} className="hover:text-white transition-colors">Sair</button>
      </div>
    </header>
  )
}
