import { useParams, useNavigate } from 'react-router-dom'

type StatusOcorrencia = 'Registrada' | 'Em análise' | 'Aguardando assinatura' | 'Concluída'

interface TimelineItem {
  status: StatusOcorrencia
  data: string
  responsavel: string
  observacao?: string
}

interface DetalhesMock {
  protocolo: string
  status: StatusOcorrencia
  dataFato: string
  horaFato: string
  bpm: string
  local: string
  policiais: { nome: string; patente: string; matricula: string }[]
  arma: string
  calibre: string
  disparos: number
  armaApreendida: boolean
  vitimasFatais: number
  feridos: number
  narrativa: string
  timeline: TimelineItem[]
}

const mockDetalhes: Record<string, DetalhesMock> = {
  'AR-2026/0342': {
    protocolo: 'AR-2026/0342',
    status: 'Aguardando assinatura',
    dataFato: '17/06/2026',
    horaFato: '22:15',
    bpm: '12º BPM',
    local: 'Rua das Pedras, s/n — Sussuarana, Salvador/BA',
    policiais: [
      { nome: 'João Victor Santos', patente: 'Sd', matricula: '098432' },
      { nome: 'Carlos Eduardo Lima', patente: 'Sd', matricula: '101567' },
    ],
    arma: 'Pistola',
    calibre: '9mm',
    disparos: 4,
    armaApreendida: true,
    vitimasFatais: 1,
    feridos: 0,
    narrativa: 'Guarnição realizava patrulhamento ostensivo na Rua das Pedras quando avistou indivíduo em atitude suspeita. Ao ser abordado, o suspeito efetuou disparos contra os policiais, que em legítima defesa revidaram. O indivíduo foi atingido e socorrido pelo SAMU, vindo a óbito no local. Uma pistola calibre .380 com numeração raspada foi apreendida.',
    timeline: [
      { status: 'Registrada', data: '17/06/2026 às 23:41', responsavel: 'Sd. Santos — 12º BPM', observacao: 'Auto de Resistência registrado no sistema.' },
      { status: 'Em análise', data: '18/06/2026 às 08:15', responsavel: 'COPPM/BA — Seção de Análise', observacao: 'Documentação encaminhada para análise da corregedoria.' },
      { status: 'Aguardando assinatura', data: '18/06/2026 às 10:30', responsavel: 'COPPM/BA', observacao: 'Pendente assinatura dos policiais envolvidos.' },
    ],
  },
}

const STATUS_STEPS: StatusOcorrencia[] = [
  'Registrada', 'Em análise', 'Aguardando assinatura', 'Concluída',
]

const statusColors: Record<StatusOcorrencia, string> = {
  'Registrada': 'bg-gray-100 text-gray-600',
  'Em análise': 'bg-blue-100 text-blue-700',
  'Aguardando assinatura': 'bg-yellow-100 text-yellow-700',
  'Concluída': 'bg-green-100 text-green-700',
}

export function DetalhesOcorrencia() {
  const { id } = useParams()
  const navigate = useNavigate()
  const ocorrencia = id ? mockDetalhes[id] : null

  if (!ocorrencia) {
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

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button onClick={() => navigate('/ocorrencias')} className="text-sm text-gray-400 hover:text-gray-700 mb-2 flex items-center gap-1">
            ← Voltar
          </button>
          <h1 className="text-xl font-bold text-gray-900">{ocorrencia.protocolo}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{ocorrencia.dataFato} às {ocorrencia.horaFato} — {ocorrencia.bpm}</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusColors[ocorrencia.status]}`}>
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

        {/* Log da timeline */}
        <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-4">
          {ocorrencia.timeline.map((item, i) => (
            <div key={i} className="flex gap-3 text-sm">
              <div className="text-gray-400 whitespace-nowrap text-xs pt-0.5">{item.data}</div>
              <div>
                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded mr-2 ${statusColors[item.status]}`}>{item.status}</span>
                <span className="text-gray-600">{item.responsavel}</span>
                {item.observacao && <p className="text-xs text-gray-400 mt-0.5">{item.observacao}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Dados gerais */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-800 mb-4">Dados da ocorrência</p>
          <dl className="flex flex-col gap-2 text-sm">
            <div><dt className="text-xs text-gray-400 uppercase">Local</dt><dd className="text-gray-700">{ocorrencia.local}</dd></div>
            <div><dt className="text-xs text-gray-400 uppercase">Arma utilizada</dt><dd className="text-gray-700">{ocorrencia.arma} — {ocorrencia.calibre}</dd></div>
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

      {/* Assinatura */}
      {ocorrencia.status === 'Aguardando assinatura' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-yellow-800">Assinatura pendente</p>
            <p className="text-xs text-yellow-600 mt-0.5">Este auto aguarda a assinatura dos policiais envolvidos.</p>
          </div>
          <button className="bg-gray-900 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-black transition-colors">
            Assinar Termo
          </button>
        </div>
      )}
    </div>
  )
}
