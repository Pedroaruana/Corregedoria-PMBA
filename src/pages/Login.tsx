export function Login() {
  return (
    <div className="min-h-screen bg-[#0d1b2a] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">PM</span>
          </div>
          <h1 className="text-lg font-bold text-gray-900">COPPM/BA</h1>
          <p className="text-xs text-gray-500 mt-1">Corregedoria da Polícia Militar da Bahia</p>
        </div>

        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Matrícula
            </label>
            <input
              type="text"
              placeholder="Ex: 123456"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-2 rounded-md text-sm font-semibold hover:bg-blue-800 transition-colors mt-2"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}
