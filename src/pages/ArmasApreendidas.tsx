import { useState } from 'react'
import glock17 from '@/assets/armas/glock17.png'
import pt100 from '@/assets/armas/pt100.png'
import rt85 from '@/assets/armas/rt85.png'
import ct40 from '@/assets/armas/ct40.png'
import akm from '@/assets/armas/akm.png'
import ar15 from '@/assets/armas/ar15-ruger.png'

interface Arma {
  registro: string
  tipo: string
  modelo: string
  calibre: string
  numeroSerie: string
  caso: string
  bpm: string
  dataApreensao: string
  status: 'Em custódia' | 'Liberada' | 'Aguardando perícia'
  foto: string
}

const armas: Arma[] = [
  {
    registro: 'ARM-2026/0421',
    tipo: 'Pistola',
    modelo: 'Glock G17 Gen5',
    calibre: '9mm',
    numeroSerie: 'BKLH729',
    caso: 'AR-2026/0342',
    bpm: '18º BPM',
    dataApreensao: '14/03/2026',
    status: 'Em custódia',
    foto: glock17,
  },
  {
    registro: 'ARM-2026/0418',
    tipo: 'Pistola',
    modelo: 'Taurus PT 100',
    calibre: '.40 S&W',
    numeroSerie: 'SUH33102',
    caso: 'AR-2026/0289',
    bpm: 'RONDESP',
    dataApreensao: '28/02/2026',
    status: 'Aguardando perícia',
    foto: pt100,
  },
  {
    registro: 'ARM-2026/0402',
    tipo: 'Revólver',
    modelo: 'Taurus RT 85',
    calibre: '.38 SPL',
    numeroSerie: 'AB221456',
    caso: 'AR-2026/0201',
    bpm: '1º BPM',
    dataApreensao: '10/02/2026',
    status: 'Em custódia',
    foto: rt85,
  },
  {
    registro: 'ARM-2026/0388',
    tipo: 'Carabina',
    modelo: 'Taurus CT40',
    calibre: '.40 S&W',
    numeroSerie: 'TCT44871',
    caso: 'AR-2026/0178',
    bpm: 'CIPE Leste',
    dataApreensao: '29/01/2026',
    status: 'Em custódia',
    foto: ct40,
  },
  {
    registro: 'ARM-2026/0371',
    tipo: 'Fuzil',
    modelo: 'AKM',
    calibre: '7.62×39mm',
    numeroSerie: 'AKM99721',
    caso: 'AR-2026/0095',
    bpm: 'BPRv',
    dataApreensao: '08/01/2026',
    status: 'Em custódia',
    foto: akm,
  },
  {
    registro: 'ARM-2025/2104',
    tipo: 'Fuzil',
    modelo: 'AR-15 Ruger',
    calibre: '5.56mm',
    numeroSerie: 'RUG88231',
    caso: 'AR-2025/1847',
    bpm: '12º BPM',
    dataApreensao: '22/12/2025',
    status: 'Liberada',
    foto: ar15,
  },
]

const statusBadge: Record<Arma['status'], string> = {
  'Em custódia': 'bg-blue-100 text-blue-700',
  'Liberada': 'bg-gray-100 text-gray-600',
  'Aguardando perícia': 'bg-yellow-100 text-yellow-700',
}

export function ArmasApreendidas() {
  const [filtro, setFiltro] = useState('')

  const filtradas = armas.filter((a) =>
    `${a.registro} ${a.modelo} ${a.numeroSerie} ${a.caso}`.toLowerCase().includes(filtro.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Armas Apreendidas</h1>
        <p className="text-sm text-gray-500 mt-0.5">Inventário da Perícia — armas vinculadas a Autos de Resistência</p>
      </div>

      <div className="flex items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Buscar por registro, modelo, número de série ou caso..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="flex-1 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
        />
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {filtradas.length} {filtradas.length === 1 ? 'arma' : 'armas'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {filtradas.map((a) => (
          <div key={a.registro} className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
            <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
              <img
                src={a.foto}
                alt={a.modelo}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/600x450/e5e7eb/6b7280?text=${encodeURIComponent(a.tipo)}`
                }}
              />
            </div>
            <div className="p-4 flex-1 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-mono text-gray-500">{a.registro}</p>
                  <p className="font-semibold text-gray-900 mt-0.5 truncate">{a.modelo}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded whitespace-nowrap ${statusBadge[a.status]}`}>
                  {a.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                <div><span className="text-gray-500">Tipo:</span> <span className="text-gray-800">{a.tipo}</span></div>
                <div><span className="text-gray-500">Calibre:</span> <span className="text-gray-800">{a.calibre}</span></div>
                <div className="col-span-2"><span className="text-gray-500">Nº de série:</span> <span className="font-mono text-gray-800">{a.numeroSerie}</span></div>
                <div className="col-span-2"><span className="text-gray-500">Caso:</span> <span className="font-mono text-blue-700">{a.caso}</span></div>
                <div><span className="text-gray-500">BPM:</span> <span className="text-gray-800">{a.bpm}</span></div>
                <div><span className="text-gray-500">Data:</span> <span className="text-gray-800">{a.dataApreensao}</span></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
