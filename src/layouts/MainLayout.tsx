import { NavLink, Outlet } from 'react-router-dom'
import { Header } from '@/components/Header'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/ocorrencias', label: 'Ocorrências' },
  { to: '/ocorrencias/nova', label: 'Nova Ocorrência' },
]

export function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-black text-white flex flex-col">
        <div className="px-6 py-5 border-b border-white/10">
          <p className="text-xs font-semibold text-blue-300 uppercase tracking-widest">COPPM/BA</p>
          <p className="text-sm text-white/70 mt-1">Corregedoria da PM da Bahia</p>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-white/10">
          <button className="text-sm text-white/50 hover:text-white transition-colors">
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
