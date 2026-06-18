import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Status = 'Todos' | 'Registrada' | 'Em análise' | 'Aguardando assinatura' | 'Concluída'

interface Ocorrencia {
  protocolo: string
  data: string
  hora: string
  local: string
  bpm: string
  policiais: string
  status: Exclude<Status, 'Todos'>
  vitimasFatais: number
}

const mockOcorrencias: Ocorrencia[] = [
  { protocolo: 'AR-2026/0342', data: '17/06/2026', hora: '22:15', local: 'Sussuarana, Salvador', bpm: '12º BPM', policiais: 'Sd. Santos / Sd. Lima', status: 'Aguardando assinatura', vitimasFatais: 1 },
  { protocolo: 'AR-2026/0339', data: '15/06/2026', hora: '03:40', local: 'Itapuã, Salvador', bpm: '9º BPM', policiais: 'Cb. Ferreira / Sd. Almeida', status: 'Em análise', vitimasFatais: 1 },
  { protocolo: 'AR-2026/0338', data: '14/06/2026', hora: '21:08', local: 'Cajazeiras, Salvador', bpm: '12º BPM', policiais: 'Sd. Rocha / Sd. Pereira', status: 'Concluída', vitimasFatais: 1 },
  { protocolo: 'AR-2026/0335', data: '11/06/2026', hora: '18:55', local: 'Liberdade, Salvador', bpm: '11º BPM', policiais: '3º Sgt. Oliveira / Cb. Melo', status: 'Concluída', vitimasFatais: 2 },
  { protocolo: 'AR-2026/0330', data: '07/06/2026', hora: '00:30', local: 'Pau da Lima, Salvador', bpm: '12º BPM', policiais: 'Sd. Costa / Sd. Barbosa', status: 'Concluída', vitimasFatais: 1 },
  { protocolo: 'AR-2026/0321', data: '01/06/2026', hora: '14:22', local: 'Feira de Santana', bpm: '4º BPM', policiais: 'Cb. Souza / Sd. Reis', status: 'Concluída', vitimasFatais: 1 },
  { protocolo: 'AR-2026/0318', data: '28/05/2026', hora: '23:10', local: 'Tancredo Neves, Salvador', bpm: '11º BPM', policiais: '2º Sgt. Nunes / Sd. Gomes', status: 'Concluída', vitimasFatais: 1 },
]

const statusColors: Record<Exclude<Status, 'Todos'>, string> = {
  'Registrada': 'bg-gray-100 text-gray-600',
  'Em análise': 'bg-blue-100 text-blue-700',
  'Aguardando assinatura': 'bg-yellow-100 text-yellow-700',
  'Concluída': 'bg-green-100 text-green-700',
}

const STATUS_FILTERS: Status[] = ['Todos', 'Registrada', 'Em análise', 'Aguardando assinatura', 'Concluída']

export function Ocorrencias() {
  const [busca, setBusca] = useState('')
  const [statusFiltro, setStatusFiltro] = useState<Status>('Todos')
  const navigate = useNavigate()

  const filtradas = mockOcorrencias.filter(o => {
    const matchBusca = o.protocolo.toLowerCase().includes(busca.toLowerCase())
      || o.local.toLowerCase().includes(busca.toLowerCase())
      || o.policiais.toLowerCase().includes(busca.toLowerCase())
    const matchStatus = statusFiltro === 'Todos' || o.status === statusFiltro
    return matchBusca && matchStatus
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Ocorrências</h1>
          <p className="text-sm text-gray-500 mt-0.5">Autos de Resistência registrados</p>
        </div>
        <button
          onClick={() => navigate('/ocorrencias/nova')}
          className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-black transition-colors"
        >
          + Nova Ocorrência
        </button>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Buscar por protocolo, local ou policial..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 w-80"
        />
        <div className="flex gap-1">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setStatusFiltro(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                statusFiltro === s
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Protocolo</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data / Hora</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Local</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">BPM</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Policiais</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtradas.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">
                  Nenhuma ocorrência encontrada
                </td>
              </tr>
            ) : (
              filtradas.map(o => (
                <tr key={o.protocolo} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-900">{o.protocolo}</td>
                  <td className="px-4 py-3 text-gray-600">{o.data}<br /><span className="text-xs text-gray-400">{o.hora}</span></td>
                  <td className="px-4 py-3 text-gray-600">{o.local}</td>
                  <td className="px-4 py-3 text-gray-600">{o.bpm}</td>
                  <td className="px-4 py-3 text-gray-600">{o.policiais}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${statusColors[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/ocorrencias/${encodeURIComponent(o.protocolo)}`)}
                      className="text-xs text-gray-400 hover:text-gray-900 transition-colors font-medium"
                    >
                      Ver →
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">
          {filtradas.length} de {mockOcorrencias.length} registros
        </div>
      </div>
    </div>
  )
}
