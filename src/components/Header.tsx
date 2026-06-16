export function Header() {
  return (
    <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <p className="text-sm text-gray-500">Sistema de Registro de Ocorrências</p>
      <div className="flex items-center gap-3">
        <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-1 rounded">
          SD
        </span>
        <span className="text-sm font-medium text-gray-700">Sd. Pedro Aruana</span>
      </div>
    </header>
  )
}
