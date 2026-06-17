import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const statsCards = [
  { label: 'Autos de Resistência', value: '7', sub: 'registrados este mês', color: 'border-l-gray-900' },
  { label: 'Aguardando assinatura', value: '3', sub: 'pendentes de conclusão', color: 'border-l-yellow-500' },
  { label: 'Laudos Cellebrite', value: '2', sub: 'pendentes de análise', color: 'border-l-blue-600' },
  { label: 'Fila GrayKey', value: '1', sub: 'dispositivo em extração', color: 'border-l-red-500' },
]

const grafico = [
  { mes: 'Jan', ocorrencias: 4 },
  { mes: 'Fev', ocorrencias: 6 },
  { mes: 'Mar', ocorrencias: 3 },
  { mes: 'Abr', ocorrencias: 8 },
  { mes: 'Mai', ocorrencias: 5 },
  { mes: 'Jun', ocorrencias: 7 },
]

type FeedTipo = 'cellebrite' | 'graykey' | 'assinatura' | 'laudo' | 'registro'

interface FeedItem {
  id: number
  tipo: FeedTipo
  descricao: string
  caso: string
  data: string
}

const feedAtividades: FeedItem[] = [
  {
    id: 1,
    tipo: 'cellebrite',
    descricao: 'Relatório Cellebrite UFED Touch 2 recebido — Samsung Galaxy A54 (IMEI: 352···891)',
    caso: 'AR-2026/0342',
    data: 'Hoje, 16:42',
  },
  {
    id: 2,
    tipo: 'graykey',
    descricao: 'Extração GrayKey concluída — Apple iPhone 15 Pro — Operação Litoral Sul',
    caso: 'AR-2026/0339',
    data: 'Hoje, 11:20',
  },
  {
    id: 3,
    tipo: 'assinatura',
    descricao: 'Auto de Resistência assinado — Cb. Ferreira / Sd. Almeida — 12º BPM',
    caso: 'AR-2026/0338',
    data: 'Ontem, 17:05',
  },
  {
    id: 4,
    tipo: 'laudo',
    descricao: 'Laudo pericial do IML recebido — vítima identificada como Marcos A. S., 28 anos',
    caso: 'AR-2026/0335',
    data: 'Ontem, 09:30',
  },
  {
    id: 5,
    tipo: 'cellebrite',
    descricao: 'Cellebrite Physical Analyzer — relatório exportado — iPhone 13 (iOS 17.4.1)',
    caso: 'AR-2026/0330',
    data: '14/06, 14:18',
  },
  {
    id: 6,
    tipo: 'registro',
    descricao: 'Novo Auto de Resistência registrado — Sd. Santos / Sd. Lima — 9º BPM, Itapuã',
    caso: 'AR-2026/0342',
    data: '13/06, 22:47',
  },
]

const feedBadge: Record<FeedTipo, { label: string; className: string }> = {
  cellebrite: { label: 'Cellebrite', className: 'bg-blue-100 text-blue-700' },
  graykey:    { label: 'GrayKey',   className: 'bg-purple-100 text-purple-700' },
  assinatura: { label: 'Assinatura', className: 'bg-green-100 text-green-700' },
  laudo:      { label: 'Laudo IML', className: 'bg-yellow-100 text-yellow-700' },
  registro:   { label: 'Registro',  className: 'bg-gray-100 text-gray-600' },
}

export function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Visão geral — Corregedoria PMBA</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <div key={card.label} className={`bg-white rounded-lg border border-gray-200 border-l-4 ${card.color} p-4`}>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm font-semibold text-gray-700 mt-1">{card.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Gráfico */}
        <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-800 mb-4">Ocorrências por mês — 2026</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={grafico} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #e5e7eb' }}
                cursor={{ fill: '#f9fafb' }}
              />
              <Bar dataKey="ocorrencias" fill="#111827" radius={[4, 4, 0, 0]} name="Ocorrências" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status rápido */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-800 mb-4">Status das ocorrências</p>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Concluídas', value: 12, total: 19, color: 'bg-gray-900' },
              { label: 'Em análise', value: 4, total: 19, color: 'bg-blue-500' },
              { label: 'Ag. assinatura', value: 3, total: 19, color: 'bg-yellow-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{item.label}</span>
                  <span className="font-semibold text-gray-700">{item.value}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${(item.value / item.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feed de atividades */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <p className="text-sm font-semibold text-gray-800 mb-4">Atividades recentes</p>
        <div className="flex flex-col divide-y divide-gray-50">
          {feedAtividades.map((item) => {
            const badge = feedBadge[item.tipo]
            return (
              <div key={item.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded whitespace-nowrap mt-0.5 ${badge.className}`}>
                  {badge.label}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 leading-snug">{item.descricao}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Caso {item.caso}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{item.data}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
