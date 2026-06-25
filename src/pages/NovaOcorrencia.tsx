import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { OcorrenciaData, Patente, TipoArma, Calibre } from '@/types/ocorrencia'
import { gerarProtocolo } from '@/utils/protocolo'
import { api } from '@/services/api'

const PATENTES: Patente[] = [
  'Sd', 'Cb', '3º Sgt', '2º Sgt', '1º Sgt', 'Sub Ten',
  'Asp', '2º Ten', '1º Ten', 'Cap', 'Maj', 'TC', 'Cel',
]

const TIPOS_ARMA: TipoArma[] = [
  'Pistola', 'Revólver', 'Fuzil', 'Espingarda', 'Submetralhadora', 'Carabina',
]

const CALIBRES: Calibre[] = [
  '9mm', '.40 S&W', '.380 ACP', '.38 SPL', '5.56mm', '7.62mm', '12', '.357 Mag', '.45 ACP',
]

const BPMS = [
  '1º BPM', '2º BPM', '3º BPM', '4º BPM', '5º BPM', '6º BPM',
  '7º BPM', '8º BPM', '9º BPM', '10º BPM', '11º BPM', '12º BPM',
  '13º BPM', '14º BPM', '15º BPM', '16º BPM', '17º BPM', '18º BPM',
  '19º BPM', '20º BPM', '21º BPM', 'RONDESP', 'CIPE', 'BPRv',
]

const initialData: OcorrenciaData = {
  dadosGerais: {
    protocolo: gerarProtocolo(),
    dataFato: '',
    horaFato: '',
    bpm: '',
    municipio: '',
    bairro: '',
    logradouro: '',
  },
  policiais: [{ matricula: '', nome: '', patente: 'Sd', emServico: true }],
  armamento: {
    tipoArma: 'Pistola',
    calibre: '9mm',
    disparosEfetuados: 0,
    armaApreendida: false,
    tipoArmaApreendida: '',
    calibreApreendido: '',
    municaoApreendida: 0,
  },
  narrativa: '',
  vitimasFatais: 0,
  feridos: 0,
  status: 'Registrada',
}

const STEPS = ['Dados Gerais', 'Policiais', 'Armamento', 'Narrativa']

const inputClass = 'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1'
const selectClass = inputClass + ' bg-white'

export function NovaOcorrencia() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<OcorrenciaData>(initialData)
  const [submitted, setSubmitted] = useState(false)
  const [enviando, setEnviando] = useState(false)

  async function handleRegistrar() {
    setEnviando(true)
    try {
      await api.criarOcorrencia({
        protocolo: data.dadosGerais.protocolo,
        dataFato: data.dadosGerais.dataFato,
        horaFato: data.dadosGerais.horaFato,
        bpm: data.dadosGerais.bpm,
        municipio: data.dadosGerais.municipio,
        bairro: data.dadosGerais.bairro,
        logradouro: data.dadosGerais.logradouro,
        narrativa: data.narrativa,
        vitimasFatais: Number(data.vitimasFatais),
        feridos: Number(data.feridos),
        tipoArma: data.armamento.tipoArma,
        calibre: data.armamento.calibre,
        disparos: Number(data.armamento.disparosEfetuados),
        armaApreendida: data.armamento.armaApreendida,
        policiais: data.policiais.map(p => ({
          nome: p.nome,
          patente: p.patente,
          matricula: p.matricula,
          bpm: data.dadosGerais.bpm,
        })),
        status: 'Aguardando Assinatura',
      })
      setSubmitted(true)
    } catch {
      alert('Erro ao registrar. Verifique se o servidor está rodando.')
    } finally {
      setEnviando(false)
    }
  }

  function updateDadosGerais(field: string, value: string) {
    setData(prev => ({ ...prev, dadosGerais: { ...prev.dadosGerais, [field]: value } }))
  }

  function updatePolicial(index: number, field: string, value: string | boolean) {
    setData(prev => {
      const policiais = [...prev.policiais]
      policiais[index] = { ...policiais[index], [field]: value }
      return { ...prev, policiais }
    })
  }

  function adicionarPolicial() {
    setData(prev => ({
      ...prev,
      policiais: [...prev.policiais, { matricula: '', nome: '', patente: 'Sd', emServico: true }],
    }))
  }

  function removerPolicial(index: number) {
    setData(prev => ({
      ...prev,
      policiais: prev.policiais.filter((_, i) => i !== index),
    }))
  }

  function updateArmamento(field: string, value: string | number | boolean) {
    setData(prev => ({ ...prev, armamento: { ...prev.armamento, [field]: value } }))
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto mt-12 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-green-600 text-2xl">✓</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Ocorrência Registrada</h2>
        <p className="text-gray-500 mb-1">Protocolo: <span className="font-bold text-gray-900">{data.dadosGerais.protocolo}</span></p>
        <p className="text-sm text-gray-400 mb-6">O Auto de Resistência foi registrado e aguarda assinatura dos envolvidos.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate('/ocorrencias')}
            className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Ver Ocorrências
          </button>
          <button
            onClick={() => { setData({ ...initialData, dadosGerais: { ...initialData.dadosGerais, protocolo: gerarProtocolo() } }); setStep(0); setSubmitted(false) }}
            className="bg-gray-900 text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-black transition-colors"
          >
            Nova Ocorrência
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">Novo Auto de Resistência</h1>
        <p className="text-sm text-gray-500 mt-1">Protocolo: <span className="font-semibold">{data.dadosGerais.protocolo}</span></p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center mb-8">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                i < step ? 'bg-gray-900 border-gray-900 text-white'
                : i === step ? 'border-gray-900 text-gray-900'
                : 'border-gray-300 text-gray-300'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs mt-1 whitespace-nowrap ${i === step ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-4 ${i < step ? 'bg-gray-900' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

        {/* Step 1 - Dados Gerais */}
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-gray-800 mb-2">Dados da Ocorrência</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Data do fato</label>
                <input type="date" className={inputClass} value={data.dadosGerais.dataFato}
                  onChange={e => updateDadosGerais('dataFato', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Hora do fato</label>
                <input type="time" className={inputClass} value={data.dadosGerais.horaFato}
                  onChange={e => updateDadosGerais('horaFato', e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelClass}>BPM responsável</label>
              <select className={selectClass} value={data.dadosGerais.bpm}
                onChange={e => updateDadosGerais('bpm', e.target.value)}>
                <option value="">Selecione o BPM</option>
                {BPMS.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Município</label>
                <input type="text" className={inputClass} placeholder="Ex: Salvador"
                  value={data.dadosGerais.municipio}
                  onChange={e => updateDadosGerais('municipio', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Bairro</label>
                <input type="text" className={inputClass} placeholder="Ex: Sussuarana"
                  value={data.dadosGerais.bairro}
                  onChange={e => updateDadosGerais('bairro', e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Logradouro</label>
              <input type="text" className={inputClass} placeholder="Ex: Rua das Pedras, s/n"
                value={data.dadosGerais.logradouro}
                onChange={e => updateDadosGerais('logradouro', e.target.value)} />
            </div>
          </div>
        )}

        {/* Step 2 - Policiais */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-gray-800 mb-2">Policiais Envolvidos</h2>
            {data.policiais.map((pol, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 relative">
                <span className="text-xs font-bold text-gray-400 uppercase mb-3 block">Policial {i + 1}</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Matrícula</label>
                    <input type="text" className={inputClass} placeholder="Ex: 098765"
                      value={pol.matricula}
                      onChange={e => updatePolicial(i, 'matricula', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Patente</label>
                    <select className={selectClass} value={pol.patente}
                      onChange={e => updatePolicial(i, 'patente', e.target.value)}>
                      {PATENTES.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Nome completo</label>
                    <input type="text" className={inputClass} placeholder="Ex: João Silva Santos"
                      value={pol.nome}
                      onChange={e => updatePolicial(i, 'nome', e.target.value)} />
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <input type="checkbox" id={`servico-${i}`} checked={pol.emServico}
                      onChange={e => updatePolicial(i, 'emServico', e.target.checked)}
                      className="rounded border-gray-300" />
                    <label htmlFor={`servico-${i}`} className="text-sm text-gray-700">Em serviço no momento do fato</label>
                  </div>
                </div>
                {data.policiais.length > 1 && (
                  <button onClick={() => removerPolicial(i)}
                    className="absolute top-3 right-3 text-xs text-red-500 hover:text-red-700">
                    Remover
                  </button>
                )}
              </div>
            ))}
            <button onClick={adicionarPolicial}
              className="text-sm text-gray-600 border border-dashed border-gray-300 rounded-lg py-2 hover:border-gray-500 hover:text-gray-900 transition-colors">
              + Adicionar policial
            </button>
          </div>
        )}

        {/* Step 3 - Armamento */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-gray-800 mb-2">Armamento Utilizado</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Tipo de arma</label>
                <select className={selectClass} value={data.armamento.tipoArma}
                  onChange={e => updateArmamento('tipoArma', e.target.value)}>
                  {TIPOS_ARMA.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Calibre</label>
                <select className={selectClass} value={data.armamento.calibre}
                  onChange={e => updateArmamento('calibre', e.target.value)}>
                  {CALIBRES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Disparos efetuados</label>
                <input type="number" min={0} className={inputClass} value={data.armamento.disparosEfetuados}
                  onChange={e => updateArmamento('disparosEfetuados', Number(e.target.value))} />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={data.armamento.armaApreendida}
                    onChange={e => updateArmamento('armaApreendida', e.target.checked)}
                    className="rounded border-gray-300" />
                  Arma apreendida do suspeito
                </label>
              </div>
            </div>

            {data.armamento.armaApreendida && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <p className="text-xs font-bold text-gray-500 uppercase mb-3">Arma apreendida</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>Tipo</label>
                    <select className={selectClass} value={data.armamento.tipoArmaApreendida}
                      onChange={e => updateArmamento('tipoArmaApreendida', e.target.value)}>
                      <option value="">Selecione</option>
                      {TIPOS_ARMA.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Calibre</label>
                    <select className={selectClass} value={data.armamento.calibreApreendido}
                      onChange={e => updateArmamento('calibreApreendido', e.target.value)}>
                      <option value="">Selecione</option>
                      {CALIBRES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Munições apreendidas</label>
                    <input type="number" min={0} className={inputClass}
                      value={data.armamento.municaoApreendida}
                      onChange={e => updateArmamento('municaoApreendida', Number(e.target.value))} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4 - Narrativa + Revisão */}
        {step === 3 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="font-semibold text-gray-800 mb-2">Narrativa dos Fatos</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelClass}>Vítimas fatais</label>
                  <input type="number" min={0} className={inputClass} value={data.vitimasFatais}
                    onChange={e => setData(prev => ({ ...prev, vitimasFatais: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className={labelClass}>Feridos</label>
                  <input type="number" min={0} className={inputClass} value={data.feridos}
                    onChange={e => setData(prev => ({ ...prev, feridos: Number(e.target.value) }))} />
                </div>
              </div>
              <label className={labelClass}>Descrição dos fatos</label>
              <textarea rows={5} className={inputClass} placeholder="Descreva detalhadamente o ocorrido..."
                value={data.narrativa}
                onChange={e => setData(prev => ({ ...prev, narrativa: e.target.value }))} />
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Revisão</h3>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div><dt className="text-gray-500">Protocolo</dt><dd className="font-semibold">{data.dadosGerais.protocolo}</dd></div>
                <div><dt className="text-gray-500">BPM</dt><dd className="font-semibold">{data.dadosGerais.bpm || '—'}</dd></div>
                <div><dt className="text-gray-500">Data/Hora</dt><dd className="font-semibold">{data.dadosGerais.dataFato} {data.dadosGerais.horaFato}</dd></div>
                <div><dt className="text-gray-500">Local</dt><dd className="font-semibold">{data.dadosGerais.bairro || '—'}, {data.dadosGerais.municipio || '—'}</dd></div>
                <div><dt className="text-gray-500">Policiais</dt><dd className="font-semibold">{data.policiais.length}</dd></div>
                <div><dt className="text-gray-500">Arma</dt><dd className="font-semibold">{data.armamento.tipoArma} {data.armamento.calibre}</dd></div>
                <div><dt className="text-gray-500">Disparos</dt><dd className="font-semibold">{data.armamento.disparosEfetuados}</dd></div>
                <div><dt className="text-gray-500">Vítimas fatais</dt><dd className="font-semibold">{data.vitimasFatais}</dd></div>
              </dl>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Voltar
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)}
              className="px-6 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-black transition-colors font-semibold">
              Próximo
            </button>
          ) : (
            <button
              disabled={enviando}
              onClick={handleRegistrar}
              className="px-6 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-black transition-colors font-semibold disabled:opacity-60">
              {enviando ? 'Registrando...' : 'Registrar Ocorrência'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
