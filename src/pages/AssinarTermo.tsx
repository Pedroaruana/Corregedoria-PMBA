import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import brasao from '@/assets/PMBA.png'
import { gerarPDFAutoResistencia } from '@/utils/gerarPDF'

const mockTermo = {
  protocolo: 'AR-2026/0342',
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
  vitimasFatais: 1,
  narrativa: 'Guarnição realizava patrulhamento ostensivo na Rua das Pedras quando avistou indivíduo em atitude suspeita. Ao ser abordado, o suspeito efetuou disparos contra os policiais, que em legítima defesa revidaram. O indivíduo foi atingido e socorrido pelo SAMU, vindo a óbito no local. Uma pistola calibre .380 com numeração raspada foi apreendida.',
}

export function AssinarTermo() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [matricula, setMatricula] = useState('')
  const [senha, setSenha] = useState('')
  const [assinado, setAssinado] = useState(false)
  const [erro, setErro] = useState('')
  const [horaAssinatura] = useState(() => {
    const now = new Date()
    return now.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
  })

  const protocolo = id ? decodeURIComponent(id) : mockTermo.protocolo

  function handleAssinar(e: React.FormEvent) {
    e.preventDefault()
    if (!matricula || !senha) {
      setErro('Preencha a matrícula e a senha para assinar.')
      return
    }
    if (senha.length < 4) {
      setErro('Senha inválida.')
      return
    }
    setErro('')
    setAssinado(true)
  }

  if (assinado) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Termo Assinado</h2>
          <p className="text-sm text-gray-500 mb-4">
            Auto de Resistência <span className="font-semibold text-gray-800">{protocolo}</span> assinado com sucesso.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left text-sm mb-6 border border-gray-200">
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">Assinado por</span>
              <span className="font-semibold">Mat. {matricula}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">Data / Hora</span>
              <span className="font-semibold">{horaAssinatura}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="font-semibold text-green-700">Concluída</span>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => gerarPDFAutoResistencia({
                ...mockTermo,
                armaApreendida: true,
                feridos: 0,
                assinadoPor: matricula,
                dataAssinatura: horaAssinatura,
              })}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Baixar PDF
            </button>
            <button
              onClick={() => navigate('/ocorrencias')}
              className="bg-gray-900 text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-black transition-colors"
            >
              Voltar para ocorrências
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <div>
        <button onClick={() => navigate(-1)} className="text-sm text-gray-400 hover:text-gray-700 mb-2 flex items-center gap-1">
          ← Voltar
        </button>
        <h1 className="text-xl font-bold text-gray-900">Assinatura do Termo</h1>
        <p className="text-sm text-gray-500 mt-0.5">Auto de Resistência — {protocolo}</p>
      </div>

      {/* Documento oficial */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        {/* Cabeçalho do documento */}
        <div className="flex items-center gap-4 border-b-2 border-gray-900 pb-4 mb-6">
          <img src={brasao} alt="Brasão PMBA" className="w-14 h-14 object-contain" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Estado da Bahia</p>
            <p className="font-bold text-gray-900 text-sm uppercase tracking-wide">Polícia Militar da Bahia</p>
            <p className="text-xs text-gray-500">Corregedoria — COPPM/BA</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Documento</p>
            <p className="font-bold text-gray-900">AUTO DE RESISTÊNCIA</p>
            <p className="text-xs text-gray-500">{protocolo}</p>
          </div>
        </div>

        {/* Corpo do documento */}
        <div className="text-sm text-gray-700 leading-relaxed flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div><p className="text-gray-400 uppercase font-semibold mb-1">Data do fato</p><p>{mockTermo.dataFato}</p></div>
            <div><p className="text-gray-400 uppercase font-semibold mb-1">Hora</p><p>{mockTermo.horaFato}</p></div>
            <div><p className="text-gray-400 uppercase font-semibold mb-1">BPM</p><p>{mockTermo.bpm}</p></div>
          </div>
          <div className="text-xs">
            <p className="text-gray-400 uppercase font-semibold mb-1">Local da ocorrência</p>
            <p>{mockTermo.local}</p>
          </div>
          <div className="text-xs">
            <p className="text-gray-400 uppercase font-semibold mb-1">Policiais envolvidos</p>
            {mockTermo.policiais.map((p, i) => (
              <p key={i}>{p.patente} {p.nome} — Mat. {p.matricula}</p>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div><p className="text-gray-400 uppercase font-semibold mb-1">Arma utilizada</p><p>{mockTermo.arma} — {mockTermo.calibre}</p></div>
            <div><p className="text-gray-400 uppercase font-semibold mb-1">Disparos efetuados</p><p>{mockTermo.disparos}</p></div>
            <div><p className="text-gray-400 uppercase font-semibold mb-1">Vítimas fatais</p><p>{mockTermo.vitimasFatais}</p></div>
          </div>
          <div className="text-xs">
            <p className="text-gray-400 uppercase font-semibold mb-1">Narrativa</p>
            <p className="leading-relaxed">{mockTermo.narrativa}</p>
          </div>
        </div>

        {/* Aviso legal */}
        <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
          Ao assinar este termo, o policial declara que as informações prestadas são verídicas e assume responsabilidade legal pelo conteúdo deste Auto de Resistência, conforme Art. 299 do Código Penal Brasileiro.
        </div>
      </div>

      {/* Formulário de assinatura */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-sm font-semibold text-gray-800 mb-4">Confirmar identidade para assinar</p>
        <form onSubmit={handleAssinar} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula</label>
              <input
                type="text"
                placeholder="Ex: 098432"
                value={matricula}
                onChange={e => setMatricula(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
            </div>
          </div>
          {erro && <p className="text-xs text-red-600">{erro}</p>}
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2.5 rounded-md text-sm font-semibold hover:bg-black transition-colors"
          >
            Assinar Termo Digitalmente
          </button>
        </form>
      </div>
    </div>
  )
}
