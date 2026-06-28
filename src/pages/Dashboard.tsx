import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { api } from '@/services/api'
import type { DashboardStats } from '@/services/api'

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
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    api.getStats().then(setStats).catch(console.error)
  }, [])

  const total = stats?.total ?? '—'
  const aguardando = stats?.porStatus['Aguardando Assinatura'] ?? '—'
  const porMes = stats?.porMes ?? []

  const statusItems = stats ? [
    { label: 'Concluídas', value: stats.porStatus['Concluída'] ?? 0, color: 'bg-gray-900' },
    { label: 'Em análise', value: stats.porStatus['Em Análise'] ?? 0, color: 'bg-blue-500' },
    { label: 'Ag. assinatura', value: stats.porStatus['Aguardando Assinatura'] ?? 0, color: 'bg-yellow-500' },
  ] : []

  const totalStatus = statusItems.reduce((acc, i) => acc + i.value, 0) || 1

  const statsCards = [
    { label: 'Autos de Resistência', value: String(total), sub: 'registrados no sistema', color: 'border-l-gray-900' },
    { label: 'Aguardando assinatura', value: String(aguardando), sub: 'pendentes de conclusão', color: 'border-l-yellow-500' },
    { label: 'Laudos Cellebrite', value: '2', sub: 'pendentes de análise', color: 'border-l-blue-600' },
    { label: 'Fila GrayKey', value: '1', sub: 'dispositivo em extração', color: 'border-l-red-500' },
  ]

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
            {card.label === 'Fila GrayKey' && (
              <button
                onClick={() => navigate('/mindspace')}
                className="mt-3 text-[11px] font-medium text-purple-600 hover:text-purple-800 border border-purple-200 hover:border-purple-400 rounded px-2 py-1 transition-colors w-full text-center"
              >
                Acessar Mindspace →
              </button>
            )}
            {card.label === 'Laudos Cellebrite' && (
              <button
                onClick={() => navigate('/cellebrite')}
                className="mt-3 text-[11px] font-medium text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 rounded px-2 py-1 transition-colors w-full text-center"
              >
                Ver em ambiente virtual →
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Gráfico */}
        <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-800 mb-4">Ocorrências por mês — 2026</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={porMes} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
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
            {stats === null ? (
              <p className="text-xs text-gray-400">Carregando...</p>
            ) : (
              statusItems.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{item.label}</span>
                    <span className="font-semibold text-gray-700">{item.value}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${(item.value / totalStatus) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
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
