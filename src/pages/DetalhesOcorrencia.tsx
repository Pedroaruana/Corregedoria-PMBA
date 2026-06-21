import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '@/services/api'
import type { OcorrenciaAPI } from '@/services/api'

const STATUS_STEPS = ['Registrada', 'Em Análise', 'Aguardando Laudo IML', 'Aguardando Assinatura', 'Concluída']

const statusColors: Record<string, string> = {
  'Registrada': 'bg-gray-100 text-gray-600',
  'Em Análise': 'bg-blue-100 text-blue-700',
  'Aguardando Laudo IML': 'bg-orange-100 text-orange-700',
  'Aguardando Assinatura': 'bg-yellow-100 text-yellow-700',
  'Concluída': 'bg-green-100 text-green-700',
}

function formatarData(data: string) {
  if (!data) return ''
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

function formatarDateTime(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

export function DetalhesOcorrencia() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ocorrencia, setOcorrencia] = useState<OcorrenciaAPI | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    api.getOcorrencia(decodeURIComponent(id))
      .then(setOcorrencia)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400 text-sm">Carregando...</div>
    )
  }

  if (notFound || !ocorrencia) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-lg font-semibold">Ocorrência não encontrada</p>
        <button onClick={() => navigate('/ocorrencias')} className="text-sm text-gray-500 hover:text-gray-900 mt-2 underline">
          Voltar para a lista
        </button>
      </div>
    )
  }

  const statusAtualIndex = STATUS_STEPS.indexOf(ocorrencia.status)
  const local = `${ocorrencia.logradouro} — ${ocorrencia.bairro}, ${ocorrencia.municipio}/BA`

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-start justify-between">
        <div>
          <button onClick={() => navigate('/ocorrencias')} className="text-sm text-gray-400 hover:text-gray-700 mb-2 flex items-center gap-1">
            ← Voltar
          </button>
          <h1 className="text-xl font-bold text-gray-900">{ocorrencia.protocolo}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {formatarData(ocorrencia.dataFato)} às {ocorrencia.horaFato} — {ocorrencia.bpm}
          </p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusColors[ocorrencia.status] ?? 'bg-gray-100 text-gray-600'}`}>
          {ocorrencia.status}
        </span>
      </div>

      {/* Timeline de status */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <p className="text-sm font-semibold text-gray-800 mb-5">Andamento do processo</p>
        <div className="flex items-start gap-0">
          {STATUS_STEPS.map((s, i) => {
            const concluido = i <= statusAtualIndex
            const atual = i === statusAtualIndex
            return (
              <div key={s} className="flex-1 flex flex-col items-center relative">
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`absolute top-3 left-1/2 w-full h-0.5 ${concluido && !atual ? 'bg-gray-900' : 'bg-gray-200'}`} />
                )}
                <div className={`w-6 h-6 rounded-full border-2 z-10 flex items-center justify-center text-xs font-bold ${
                  concluido ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-300 text-gray-300'
                }`}>
                  {concluido ? (atual ? '●' : '✓') : ''}
                </div>
                <p className={`text-xs mt-2 text-center leading-tight ${atual ? 'font-bold text-gray-900' : concluido ? 'text-gray-600' : 'text-gray-300'}`}>
                  {s}
                </p>
              </div>
            )
          })}
        </div>

        {/* Log simplificado baseado no status */}
        <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-4 text-sm">
          <div className="flex gap-3">
            <div className="text-gray-400 whitespace-nowrap text-xs pt-0.5">{formatarDateTime(ocorrencia.createdAt)}</div>
            <div>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded mr-2 bg-gray-100 text-gray-600">Registrada</span>
              <span className="text-gray-600">Auto de Resistência registrado no sistema.</span>
            </div>
          </div>
          {ocorrencia.status === 'Concluída' && ocorrencia.assinadoEm && (
            <div className="flex gap-3">
              <div className="text-gray-400 whitespace-nowrap text-xs pt-0.5">{formatarDateTime(ocorrencia.assinadoEm)}</div>
              <div>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded mr-2 bg-green-100 text-green-700">Concluída</span>
                <span className="text-gray-600">Termo assinado digitalmente — Mat. {ocorrencia.assinadoPor}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Dados gerais */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-800 mb-4">Dados da ocorrência</p>
          <dl className="flex flex-col gap-2 text-sm">
            <div><dt className="text-xs text-gray-400 uppercase">Local</dt><dd className="text-gray-700">{local}</dd></div>
            <div><dt className="text-xs text-gray-400 uppercase">Arma utilizada</dt><dd className="text-gray-700">{ocorrencia.tipoArma} — {ocorrencia.calibre}</dd></div>
            <div><dt className="text-xs text-gray-400 uppercase">Disparos efetuados</dt><dd className="text-gray-700">{ocorrencia.disparos}</dd></div>
            <div><dt className="text-xs text-gray-400 uppercase">Arma apreendida</dt><dd className="text-gray-700">{ocorrencia.armaApreendida ? 'Sim' : 'Não'}</dd></div>
            <div><dt className="text-xs text-gray-400 uppercase">Vítimas fatais</dt><dd className="font-semibold text-gray-900">{ocorrencia.vitimasFatais}</dd></div>
            <div><dt className="text-xs text-gray-400 uppercase">Feridos</dt><dd className="text-gray-700">{ocorrencia.feridos}</dd></div>
          </dl>
        </div>

        {/* Policiais */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-800 mb-4">Policiais envolvidos</p>
          <div className="flex flex-col gap-3">
            {ocorrencia.policiais.map((pol, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {pol.patente}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{pol.nome}</p>
                  <p className="text-xs text-gray-400">Mat. {pol.matricula}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Narrativa */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <p className="text-sm font-semibold text-gray-800 mb-3">Narrativa dos fatos</p>
        <p className="text-sm text-gray-600 leading-relaxed">{ocorrencia.narrativa}</p>
      </div>

      {/* Assinatura pendente */}
      {ocorrencia.status === 'Aguardando Assinatura' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-yellow-800">Assinatura pendente</p>
            <p className="text-xs text-yellow-600 mt-0.5">Este auto aguarda a assinatura dos policiais envolvidos.</p>
          </div>
          <button
            onClick={() => navigate(`/ocorrencias/${encodeURIComponent(ocorrencia.protocolo)}/assinar`)}
            className="bg-gray-900 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-black transition-colors"
          >
            Assinar Termo
          </button>
        </div>
      )}
    </div>
  )
}
