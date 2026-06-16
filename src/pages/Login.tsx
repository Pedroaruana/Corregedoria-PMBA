import brasao from '@/assets/PMBA.png'

export function Login() {
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

        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Matrícula
            </label>
            <input
              type="text"
              placeholder="Ex: 123456"
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2 rounded-md text-sm font-semibold hover:bg-black transition-colors mt-2"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}
