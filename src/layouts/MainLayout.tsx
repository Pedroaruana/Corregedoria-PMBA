import { NavLink, Outlet } from 'react-router-dom'
import { Header } from '@/components/Header'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '▪' },
  { to: '/ocorrencias', label: 'Ocorrências', icon: '▪' },
  { to: '/ocorrencias/nova', label: 'Nova Ocorrência', icon: '+' },
]

export function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-black text-white flex flex-col">
        <div className="px-6 py-5 border-b border-white/10">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">COPPM/BA</p>
          <p className="text-sm font-semibold text-white">Corregedoria</p>
          <p className="text-xs text-white/50 mt-0.5">Polícia Militar da Bahia</p>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/ocorrencias'}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span className="text-xs">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-white/10">
          <button className="text-xs text-white/40 hover:text-white transition-colors uppercase tracking-widest">
            Sair
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
