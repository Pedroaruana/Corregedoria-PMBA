import { useState } from 'react'
import galaxyA54 from '@/assets/objetos/aa.webp'
import iphone13 from '@/assets/objetos/s.png'
import cocaina from '@/assets/objetos/sssssss.webp'
import municao from '@/assets/objetos/aaaaaa.png'
import dinheiro from '@/assets/objetos/das.webp'
import moto from '@/assets/objetos/download.webp'
import motoG82 from '@/assets/objetos/download.png'

type Categoria = 'Celular' | 'Veículo' | 'Documento' | 'Munição' | 'Entorpecente' | 'Dinheiro'

interface Objeto {
  registro: string
  categoria: Categoria
  descricao: string
  detalhes: string
  caso: string
  bpm: string
  dataApreensao: string
  status: 'Em custódia' | 'Liberado' | 'Periciado'
  foto: string
}

const objetos: Objeto[] = [
  {
    registro: 'OBJ-2026/1024',
    categoria: 'Celular',
    descricao: 'Samsung Galaxy A54 5G',
    detalhes: 'IMEI: 352123456789891 — bloqueado por senha — extração via Cellebrite UFED Touch 2',
    caso: 'AR-2026/0342',
    bpm: '18º BPM',
    dataApreensao: '14/03/2026',
    status: 'Periciado',
    foto: galaxyA54,
  },
  {
    registro: 'OBJ-2026/1019',
    categoria: 'Celular',
    descricao: 'Apple iPhone 13 Pro',
    detalhes: 'iOS 17.4.1 — extração via GrayKey — aguardando análise',
    caso: 'AR-2026/0339',
    bpm: '9º BPM',
    dataApreensao: '11/03/2026',
    status: 'Em custódia',
    foto: iphone13,
  },
  {
    registro: 'OBJ-2026/1011',
    categoria: 'Entorpecente',
    descricao: 'Cocaína em pó',
    detalhes: '347g — embalados em 12 invólucros plásticos — laudo IPC 0871/2026',
    caso: 'AR-2026/0289',
    bpm: 'RONDESP',
    dataApreensao: '28/02/2026',
    status: 'Periciado',
    foto: cocaina,
  },
  {
    registro: 'OBJ-2026/1003',
    categoria: 'Munição',
    descricao: 'Munição calibre 9mm',
    detalhes: '42 cartuchos intactos + 8 estojos deflagrados — marca CBC',
    caso: 'AR-2026/0342',
    bpm: '18º BPM',
    dataApreensao: '14/03/2026',
    status: 'Periciado',
    foto: municao,
  },
  {
    registro: 'OBJ-2026/0998',
    categoria: 'Dinheiro',
    descricao: 'Dinheiro em espécie',
    detalhes: 'R$ 12.847,00 — cédulas variadas (R$ 100, R$ 50, R$ 20) — bloqueado para análise patrimonial',
    caso: 'AR-2026/0289',
    bpm: 'RONDESP',
    dataApreensao: '28/02/2026',
    status: 'Em custódia',
    foto: dinheiro,
  },
  {
    registro: 'OBJ-2026/0987',
    categoria: 'Veículo',
    descricao: 'Motocicleta Yamaha YZF',
    detalhes: 'Placa SUB-2K77 — encontrada abandonada após confronto — reportada como furtada em 12/2025',
    caso: 'AR-2026/0201',
    bpm: '1º BPM',
    dataApreensao: '10/02/2026',
    status: 'Em custódia',
    foto: moto,
  },
  {
    registro: 'OBJ-2026/0955',
    categoria: 'Celular',
    descricao: 'Motorola Moto G82',
    detalhes: 'Android 13 — sem proteção de tela — extração lógica concluída',
    caso: 'AR-2026/0095',
    bpm: 'BPRv',
    dataApreensao: '08/01/2026',
    status: 'Liberado',
    foto: motoG82,
  },
]

const categoriaBadge: Record<Categoria, string> = {
  'Celular':      'bg-blue-100 text-blue-700',
  'Veículo':      'bg-orange-100 text-orange-700',
  'Documento':    'bg-purple-100 text-purple-700',
  'Munição':      'bg-red-100 text-red-700',
  'Entorpecente': 'bg-yellow-100 text-yellow-700',
  'Dinheiro':     'bg-green-100 text-green-700',
}

const statusBadge: Record<Objeto['status'], string> = {
  'Em custódia': 'bg-blue-50 text-blue-600 border border-blue-200',
  'Liberado':    'bg-gray-50 text-gray-600 border border-gray-200',
  'Periciado':   'bg-green-50 text-green-600 border border-green-200',
}


export function ObjetosApreendidos() {
  const [categoria, setCategoria] = useState<Categoria | 'Todos'>('Todos')

  const categorias: (Categoria | 'Todos')[] = ['Todos', 'Celular', 'Veículo', 'Munição', 'Entorpecente', 'Dinheiro']

  const filtrados = categoria === 'Todos'
    ? objetos
    : objetos.filter((o) => o.categoria === categoria)

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Objetos Apreendidos</h1>
        <p className="text-sm text-gray-500 mt-0.5">Inventário de objetos vinculados às ocorrências</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoria(cat)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              categoria === cat
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
            }`}
          >
            {cat}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-500">{filtrados.length} {filtrados.length === 1 ? 'objeto' : 'objetos'}</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {filtrados.map((o) => (
          <div key={o.registro} className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
            <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
              <img
                src={o.foto}
                alt={o.descricao}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-4 flex-1 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-mono text-gray-500">{o.registro}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${categoriaBadge[o.categoria]}`}>
                  {o.categoria}
                </span>
              </div>
              <p className="font-semibold text-gray-900 text-sm leading-tight">{o.descricao}</p>
              <p className="text-xs text-gray-600 leading-snug">{o.detalhes}</p>
              <div className="border-t border-gray-100 pt-2 mt-auto flex items-center justify-between text-[11px]">
                <div>
                  <p className="font-mono text-blue-700">{o.caso}</p>
                  <p className="text-gray-400 mt-0.5">{o.bpm} · {o.dataApreensao}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${statusBadge[o.status]}`}>
                  {o.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
