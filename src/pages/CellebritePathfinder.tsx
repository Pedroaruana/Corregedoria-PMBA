import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const incidentes = [
  { id: 'AR-2026/0342', titulo: 'Operação Litoral Sul', bairro: 'Itapuã', data: '14/06/2026', lat: -12.9282, lng: -38.3522, relevancia: 92, tipo: 'auto' },
  { id: 'AR-2026/0339', titulo: 'Confronto 9º BPM', bairro: 'Sussuarana', data: '11/06/2026', lat: -12.9718, lng: -38.4812, relevancia: 87, tipo: 'auto' },
  { id: 'AR-2026/0335', titulo: 'Operação Centro Histórico', bairro: 'Pelourinho', data: '08/06/2026', lat: -12.9703, lng: -38.5099, relevancia: 78, tipo: 'auto' },
  { id: 'AR-2026/0330', titulo: 'Confronto RONDESP', bairro: 'Cajazeiras', data: '02/06/2026', lat: -12.9155, lng: -38.4333, relevancia: 95, tipo: 'auto' },
  { id: 'AR-2026/0328', titulo: 'Operação CIPE Leste', bairro: 'Tancredo Neves', data: '28/05/2026', lat: -12.9491, lng: -38.4198, relevancia: 71, tipo: 'auto' },
  { id: 'AR-2026/0322', titulo: 'Confronto 40º BPM', bairro: 'Lauro de Freitas', data: '22/05/2026', lat: -12.8997, lng: -38.3312, relevancia: 65, tipo: 'auto' },
  { id: 'AR-2026/0318', titulo: 'Operação Subúrbio', bairro: 'Periperi', data: '18/05/2026', lat: -12.8712, lng: -38.4680, relevancia: 83, tipo: 'auto' },
]

const menuItems = [
  { icon: '⊞', label: 'Home' },
  { icon: '◉', label: 'Candidatos' },
  { icon: '◈', label: 'Tags' },
  { icon: '▤', label: 'Casos' },
  { icon: '⊟', label: 'Coleções' },
  { icon: '◎', label: 'Grupos' },
  { icon: '⊛', label: 'Conexões' },
  { icon: '◆', label: 'Alertas' },
  { icon: '⊕', label: 'Mapa' },
]

function relevanciaColor(r: number) {
  if (r >= 90) return '#ef4444'
  if (r >= 75) return '#f97316'
  if (r >= 60) return '#eab308'
  return '#22c55e'
}

export function CellebritePathfinder() {
  const navigate = useNavigate()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const [selecionado, setSelecionado] = useState<string | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    const map = L.map(mapRef.current, {
      center: [-12.9355, -38.4292],
      zoom: 12,
      zoomControl: false,
    })

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap, © CartoDB',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    incidentes.forEach((inc) => {
      const radius = 20 + inc.relevancia * 0.35
      const cor = relevanciaColor(inc.relevancia)

      const circle = L.circleMarker([inc.lat, inc.lng], {
        radius,
        fillColor: cor,
        fillOpacity: 0.28,
        color: cor,
        weight: 1.5,
        opacity: 0.7,
      }).addTo(map)

      const innerCircle = L.circleMarker([inc.lat, inc.lng], {
        radius: radius * 0.45,
        fillColor: cor,
        fillOpacity: 0.65,
        color: cor,
        weight: 0,
      }).addTo(map)

      circle.on('click', () => setSelecionado(inc.id))
      innerCircle.on('click', () => setSelecionado(inc.id))

      circle.bindTooltip(
        `<div style="font-family:monospace;font-size:11px;color:#fff;background:#1a1a2e;border:1px solid #333;padding:6px 10px;border-radius:4px;">
          <strong>${inc.id}</strong><br/>
          ${inc.bairro}<br/>
          Relevância: <span style="color:${cor}">${inc.relevancia}%</span>
        </div>`,
        { className: 'leaflet-tooltip-dark', permanent: false, opacity: 1 }
      )
    })

    mapInstance.current = map
    return () => {
      map.remove()
      mapInstance.current = null
    }
  }, [])

  return (
    <div className="flex h-screen bg-[#0d0d1a] text-white overflow-hidden" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Sidebar esquerda */}
      <div className="w-14 bg-[#0a0a18] border-r border-[#1e1e3a] flex flex-col items-center py-4 gap-1 z-10">
        <div className="w-8 h-8 mb-4">
          <svg viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" fill="#1a1a3e" stroke="#4a4aff" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="6" fill="#4a4aff" opacity="0.8" />
            <circle cx="16" cy="16" r="2.5" fill="#fff" />
          </svg>
        </div>
        {menuItems.map((item, i) => (
          <button
            key={i}
            title={item.label}
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-base transition-colors ${
              item.label === 'Mapa'
                ? 'bg-[#4a4aff] text-white'
                : 'text-[#666] hover:text-[#aaa] hover:bg-[#1a1a2e]'
            }`}
          >
            {item.icon}
          </button>
        ))}
      </div>

      {/* Painel central */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Header */}
        <div className="h-12 bg-[#0a0a18] border-b border-[#1e1e3a] flex items-center px-4 gap-3 flex-shrink-0">
          <span className="text-[#4a4aff] font-bold text-sm tracking-widest uppercase">Cellebrite</span>
          <span className="text-[#666] text-sm">PATHFINDER</span>
          <span className="text-[#333] mx-2">|</span>
          <span className="text-[#888] text-xs">Análise Geoespacial — COPPM/BA</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[#4ade80] text-xs font-mono">● AO VIVO</span>
            <button
              onClick={() => navigate('/dashboard')}
              className="ml-4 text-xs text-[#666] hover:text-[#aaa] border border-[#333] rounded px-3 py-1 transition-colors"
            >
              ← Sair do ambiente
            </button>
          </div>
        </div>

        {/* Barra de filtros */}
        <div className="h-10 bg-[#0d0d1a] border-b border-[#1e1e3a] flex items-center px-4 gap-4 text-xs text-[#666] flex-shrink-0">
          <span className="text-[#aaa]">Filtros:</span>
          {['Autos de Resistência', '2026', 'Salvador — BA', 'Todos os BPMs'].map((f) => (
            <span key={f} className="bg-[#1a1a2e] border border-[#2a2a4a] text-[#8888cc] px-2 py-0.5 rounded text-[10px]">
              {f} ×
            </span>
          ))}
          <span className="ml-auto text-[#444]">{incidentes.length} eventos mapeados</span>
        </div>

        {/* Mapa */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="w-full h-full" />

          {/* Legenda */}
          <div className="absolute bottom-8 left-4 bg-[#0d0d1a]/90 border border-[#1e1e3a] rounded-lg p-3 text-[10px] z-[1000]">
            <p className="text-[#666] mb-2 uppercase tracking-wider">Relevância</p>
            {[
              { cor: '#ef4444', label: '≥ 90% — Crítica' },
              { cor: '#f97316', label: '≥ 75% — Alta' },
              { cor: '#eab308', label: '≥ 60% — Média' },
              { cor: '#22c55e', label: '< 60% — Baixa' },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-2 mt-1">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: l.cor }} />
                <span className="text-[#888]">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar direita */}
      <div className="w-72 bg-[#0a0a18] border-l border-[#1e1e3a] flex flex-col flex-shrink-0">
        <div className="px-4 py-3 border-b border-[#1e1e3a]">
          <p className="text-xs text-[#666] uppercase tracking-wider mb-1">Incidentes</p>
          <p className="text-[10px] text-[#444]">Clique no mapa para selecionar</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {incidentes.map((inc) => {
            const cor = relevanciaColor(inc.relevancia)
            const ativo = selecionado === inc.id
            return (
              <button
                key={inc.id}
                onClick={() => setSelecionado(ativo ? null : inc.id)}
                className={`w-full text-left px-4 py-3 border-b border-[#0f0f20] transition-colors ${
                  ativo ? 'bg-[#1a1a3e]' : 'hover:bg-[#111128]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-mono text-[#4a8fff] truncate">{inc.id}</p>
                    <p className="text-[12px] text-[#ccc] leading-tight mt-0.5 truncate">{inc.titulo}</p>
                    <p className="text-[10px] text-[#555] mt-0.5">{inc.bairro} · {inc.data}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{ color: cor, backgroundColor: cor + '22', border: `1px solid ${cor}44` }}
                    >
                      {inc.relevancia}%
                    </span>
                  </div>
                </div>
                {ativo && (
                  <div className="mt-2 pt-2 border-t border-[#1e1e3a] text-[10px] text-[#666] space-y-1">
                    <p>Lat: {inc.lat.toFixed(4)} · Lng: {inc.lng.toFixed(4)}</p>
                    <p>Relevância de conexão: <span style={{ color: cor }}>{inc.relevancia}%</span></p>
                    <p className="text-[#4a4aff] mt-1 cursor-pointer hover:underline">Abrir ficha completa →</p>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Rodapé da sidebar */}
        <div className="px-4 py-3 border-t border-[#1e1e3a] text-[10px] text-[#444]">
          <p>Ambiente virtual — fins demonstrativos</p>
          <p className="mt-0.5">COPPM/BA · Sistema PATHFINDER v4.2</p>
        </div>
      </div>

    </div>
  )
}
