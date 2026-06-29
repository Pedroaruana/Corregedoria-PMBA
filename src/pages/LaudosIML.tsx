import { useState } from 'react'
import brasao from '@/assets/PMBA.png'

interface Laudo {
  numero: string
  caso: string
  vitima: string
  natureza: string
  local: string
  medico: string
  dataAtendimento: string
  dataLaudo: string
  causa: string
  envolvidos?: string
}

const laudos: Laudo[] = [
  {
    numero: '01.087/2026',
    caso: 'AR-2026/0342',
    vitima: 'Marcos Antônio da Silva',
    natureza: 'Exame de Necropsia',
    local: 'Rua das Flores, 120 — Periperi — Salvador/BA',
    medico: 'Dra. Bruna Trevisan Zacharias',
    dataAtendimento: '14/03/2026',
    dataLaudo: '17/03/2026',
    causa: 'Hemorragia interna decorrente de perfuração por projétil de arma de fogo (PAF) em região torácica',
  },
  {
    numero: '01.092/2026',
    caso: 'AR-2026/0339',
    vitima: 'Confronto 9º BPM — vítima identificada',
    natureza: 'Exame de Necropsia',
    local: 'Sussuarana — Salvador/BA',
    medico: 'Dr. Carlos Eduardo Vasconcelos',
    dataAtendimento: '11/03/2026',
    dataLaudo: '13/03/2026',
    causa: 'Choque hipovolêmico — múltiplos PAF em região abdominal',
  },
  {
    numero: '01.078/2026',
    caso: 'AR-2026/0289',
    vitima: 'José R. Lima Bevilaqua',
    natureza: 'Exame de Necropsia',
    local: 'Av. Presidente Dutra, 870 — Campo Limpo — Feira de Santana/BA',
    medico: 'Dra. Bruna Trevisan Zacharias',
    dataAtendimento: '28/02/2026',
    dataLaudo: '02/03/2026',
    causa: 'PAF em região cefálica — óbito imediato',
  },
  {
    numero: '01.060/2026',
    caso: 'AR-2026/0201',
    vitima: 'Carlos M. Andrade',
    natureza: 'Exame de Necropsia',
    local: 'Ladeira do Bonfim, 45 — Bonfim — Salvador/BA',
    medico: 'Dr. Roberto F. Maia',
    dataAtendimento: '10/02/2026',
    dataLaudo: '12/02/2026',
    causa: 'PAF em região torácica',
  },
  {
    numero: '01.045/2026',
    caso: 'AR-2026/0178',
    vitima: 'P. Santos Filho',
    natureza: 'Exame de Necropsia',
    local: 'Loteamento Monte Gordo — Camaçari/BA',
    medico: 'Dr. Carlos Eduardo Vasconcelos',
    dataAtendimento: '29/01/2026',
    dataLaudo: '01/02/2026',
    causa: 'Hemorragia interna — PAF múltiplos (fuzil 5.56mm)',
  },
  {
    numero: '01.031/2026',
    caso: 'AR-2026/0095',
    vitima: 'F. Andrade Júnior',
    natureza: 'Exame de Necropsia',
    local: 'Rodovia BR-116, Km 812 — Vitória da Conquista/BA',
    medico: 'Dra. Bruna Trevisan Zacharias',
    dataAtendimento: '08/01/2026',
    dataLaudo: '11/01/2026',
    causa: 'PAF — região cervical',
  },
]

export function LaudosIML() {
  const [aberto, setAberto] = useState<Laudo | null>(null)

  if (aberto) {
    return (
      <div className="flex flex-col gap-4">
        <button
          onClick={() => setAberto(null)}
          className="text-sm text-gray-600 hover:text-gray-900 self-start"
        >
          ← Voltar à lista
        </button>

        {/* Documento estilo PDF oficial */}
        <div className="bg-white border border-gray-300 max-w-3xl mx-auto w-full shadow-sm">

          {/* Cabeçalho */}
          <div className="border-b-2 border-yellow-600 px-8 py-4 flex items-center gap-4">
            <img src={brasao} alt="Brasão" className="h-16 w-auto" />
            <div className="flex-1 text-center">
              <p className="text-[10px] font-bold text-gray-800 uppercase tracking-wide">Estado da Bahia</p>
              <p className="text-[10px] font-bold text-gray-800 uppercase tracking-wide">Secretaria de Estado da Segurança Pública</p>
              <p className="text-[10px] font-bold text-gray-800 uppercase tracking-wide">e Administração Penitenciária</p>
              <p className="text-[10px] font-bold text-gray-800 uppercase tracking-wide mt-1">Polícia Científica</p>
            </div>
            <div className="bg-gray-200 border border-gray-400 w-14 h-16 flex items-center justify-center">
              <span className="text-[10px] font-bold text-gray-600">PDF</span>
            </div>
          </div>

          {/* Corpo */}
          <div className="px-8 py-6 text-[11px] text-gray-800">

            <div className="border border-gray-300">
              <div className="border-b border-gray-300 px-3 py-1.5 bg-gray-50">
                <p className="text-[9px] text-gray-500 uppercase">Dados do Órgão</p>
                <p className="font-semibold">DPC — DELEGACIA DE DELITOS DE TRÂNSITO — DETRAN — SALVADOR</p>
              </div>
              <div className="border-b border-gray-300 px-3 py-1.5">
                <p className="text-[9px] text-gray-500 uppercase">Declaração de Óbito</p>
                <p className="font-semibold">DO/{aberto.numero} — INSTITUTO MÉDICO LEGAL NECROTÉRIO IML — SALVADOR</p>
              </div>
              <div className="px-3 py-1.5">
                <p className="text-[9px] text-gray-500 uppercase">Requisitante</p>
                <p className="font-semibold">EDGAR DIAS SANTANA</p>
              </div>
            </div>

            <div className="border border-gray-300 border-t-0">
              <div className="bg-gray-100 px-3 py-2 border-b border-gray-300 text-center">
                <p className="text-[10px] text-gray-700 font-semibold">Identificação do Laudo</p>
                <p className="text-[10px] font-bold mt-1">DPC — IML — SALVADOR — NECROTÉRIO</p>
              </div>
              <div className="text-center py-4 border-b border-gray-300">
                <p className="text-lg font-bold text-gray-900">LAUDO PERICIAL</p>
                <p className="text-base font-bold text-gray-900 mt-1">{aberto.dataLaudo}</p>
                <p className="text-[9px] text-gray-500 mt-2">CASO Nº {aberto.numero}</p>
              </div>
            </div>

            <div className="border border-gray-300 border-t-0">
              <div className="border-b border-gray-300 px-3 py-1.5">
                <p className="text-[9px] text-gray-500 uppercase">Dados da Ocorrência</p>
              </div>
              <div className="border-b border-gray-300 px-3 py-1.5 grid grid-cols-[140px_1fr] gap-2">
                <p className="text-[9px] text-gray-500 uppercase">Natureza do Exame</p>
                <p className="font-semibold">{aberto.natureza.toUpperCase()}</p>
              </div>
              <div className="border-b border-gray-300 px-3 py-1.5 grid grid-cols-[140px_1fr] gap-2">
                <p className="text-[9px] text-gray-500 uppercase">Local de Ocorrência</p>
                <p className="font-semibold">{aberto.local.toUpperCase()}</p>
              </div>
              <div className="border-b border-gray-300 px-3 py-1.5 grid grid-cols-[140px_1fr] gap-2">
                <p className="text-[9px] text-gray-500 uppercase">Envolvido(s)</p>
                <p className="font-semibold">VÍTIMA(S) FATAL(IS) (CADÁVER/ES): {aberto.vitima.toUpperCase()}</p>
              </div>
              <div className="px-3 py-1.5 grid grid-cols-[140px_1fr] gap-2">
                <p className="text-[9px] text-gray-500 uppercase">Causa Mortis</p>
                <p className="font-semibold">{aberto.causa}</p>
              </div>
            </div>

            <div className="border border-gray-300 border-t-0">
              <div className="bg-gray-100 px-3 py-2 border-b border-gray-300 text-center">
                <p className="text-[10px] text-gray-700 font-semibold">DELEGACIA DE DELITOS DE TRÂNSITO — DETRAN — SALVADOR</p>
              </div>
            </div>

            <div className="border border-gray-300 border-t-0 grid grid-cols-2">
              <div className="px-3 py-2 border-r border-gray-300">
                <p className="text-[9px] text-gray-500 uppercase">Médico Legista</p>
                <p className="font-semibold mt-1">{aberto.medico.toUpperCase()}</p>
              </div>
              <div className="px-3 py-2 text-[10px]">
                <div className="flex justify-between"><span className="text-gray-500">Data de Solicitação:</span><span className="font-semibold">{aberto.dataAtendimento}</span></div>
                <div className="flex justify-between mt-1"><span className="text-gray-500">Data de Atendimento:</span><span className="font-semibold">{aberto.dataAtendimento}</span></div>
                <div className="flex justify-between mt-1"><span className="text-gray-500">Data do Laudo Gerado:</span><span className="font-semibold">{aberto.dataLaudo}</span></div>
              </div>
            </div>

            <div className="border border-gray-300 border-t-0 px-3 py-3 text-[9px] text-gray-600 leading-snug">
              <p className="font-semibold">RUA PAULO TURRIEWICZ, 150 — TARUMÃ — SALVADOR/BA</p>
              <p className="mt-1">Telefone: (71) 3320-7000 — www.policiacientifica.ba.gov.br</p>
              <p className="mt-2 text-gray-500">A reprodução deste documento somente é permitida se mantida sua integridade. É vedada a sua cópia parcial ou utilização parcial de seu conteúdo ou ainda a inclusão dele em outros documentos ou impressos.</p>
            </div>

          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Laudos IML</h1>
        <p className="text-sm text-gray-500 mt-0.5">Instituto Médico Legal — laudos periciais por caso</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Laudo Nº</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Caso</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Vítima</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Médico Legista</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Data</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {laudos.map((l) => (
              <tr key={l.numero} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-700">{l.numero}</td>
                <td className="px-4 py-3 font-mono text-xs text-blue-700">{l.caso}</td>
                <td className="px-4 py-3 text-gray-800">{l.vitima}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{l.medico}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{l.dataLaudo}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setAberto(l)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    Ver laudo →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

