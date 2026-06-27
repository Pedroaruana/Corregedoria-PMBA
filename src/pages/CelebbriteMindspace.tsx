import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Node {
  id: string
  label: string
  sublabel?: string
  tipo: 'caso' | 'suspeito' | 'dispositivo' | 'local' | 'contato'
  x: number
  y: number
  r: number
}

interface Edge {
  from: string
  to: string
  forte?: boolean
}

const NODES: Node[] = [
  // Casos centrais
  { id: 'c1', label: 'AR-2026/0342', sublabel: 'Caso principal', tipo: 'caso', x: 370, y: 270, r: 24 },
  { id: 'c2', label: 'AR-2026/0339', sublabel: 'Relacionado', tipo: 'caso', x: 230, y: 390, r: 18 },
  { id: 'c3', label: 'AR-2026/0330', sublabel: 'Relacionado', tipo: 'caso', x: 190, y: 220, r: 18 },

  // Suspeitos
  { id: 's1', label: 'Marcos A. S.', sublabel: 'Suspeito', tipo: 'suspeito', x: 490, y: 170, r: 16 },
  { id: 's2', label: 'José R. Lima', sublabel: 'Suspeito', tipo: 'suspeito', x: 500, y: 370, r: 16 },
  { id: 's3', label: 'Carlos M.', sublabel: 'Associado', tipo: 'suspeito', x: 290, y: 510, r: 13 },
  { id: 's4', label: 'P. Santos', sublabel: 'Associado', tipo: 'suspeito', x: 110, y: 340, r: 13 },
  { id: 's5', label: 'F. Andrade', sublabel: 'Associado', tipo: 'suspeito', x: 130, y: 160, r: 13 },
  { id: 's6', label: 'R. Oliveira', sublabel: 'Associado', tipo: 'suspeito', x: 420, y: 490, r: 11 },

  // Dispositivos
  { id: 'd1', label: 'iPhone 15 Pro', sublabel: 'iOS 17.4.1', tipo: 'dispositivo', x: 610, y: 200, r: 14 },
  { id: 'd2', label: 'Samsung A54', sublabel: 'IMEI: 352···891', tipo: 'dispositivo', x: 620, y: 340, r: 14 },
  { id: 'd3', label: 'Motorola G82', sublabel: 'Android 13', tipo: 'dispositivo', x: 320, y: 560, r: 12 },
  { id: 'd4', label: 'iPhone 13', sublabel: 'iOS 16.7', tipo: 'dispositivo', x: 90, y: 440, r: 12 },

  // Locais
  { id: 'l1', label: 'Itapuã', sublabel: 'Salvador — BA', tipo: 'local', x: 510, y: 480, r: 13 },
  { id: 'l2', label: 'Sussuarana', sublabel: 'Salvador — BA', tipo: 'local', x: 140, y: 490, r: 13 },
  { id: 'l3', label: 'Pelourinho', sublabel: 'Centro Histórico', tipo: 'local', x: 350, y: 140, r: 13 },

  // Hub de rede de contatos (nó grande à direita)
  { id: 'h1', label: 'Rede de Contatos', sublabel: '27 vínculos', tipo: 'contato', x: 740, y: 290, r: 20 },

  // Fan nodes (vínculos da rede)
  { id: 'f1',  label: '+55 71 9···1234', tipo: 'contato', x: 860, y: 100, r: 8 },
  { id: 'f2',  label: '+55 71 9···5678', tipo: 'contato', x: 900, y: 140, r: 8 },
  { id: 'f3',  label: '+55 71 9···9012', tipo: 'contato', x: 930, y: 180, r: 8 },
  { id: 'f4',  label: '+55 75 9···3456', tipo: 'contato', x: 950, y: 220, r: 8 },
  { id: 'f5',  label: 'Alan P.',          tipo: 'contato', x: 960, y: 260, r: 9 },
  { id: 'f6',  label: 'Bruno T.',         tipo: 'contato', x: 965, y: 300, r: 9 },
  { id: 'f7',  label: 'Diego M.',         tipo: 'contato', x: 960, y: 340, r: 9 },
  { id: 'f8',  label: '+55 71 9···7890', tipo: 'contato', x: 950, y: 380, r: 8 },
  { id: 'f9',  label: '+55 71 9···2345', tipo: 'contato', x: 930, y: 415, r: 8 },
  { id: 'f10', label: '+55 73 9···6789', tipo: 'contato', x: 900, y: 445, r: 8 },
  { id: 'f11', label: 'Rafael S.',        tipo: 'contato', x: 860, y: 470, r: 9 },
  { id: 'f12', label: 'Leandro C.',       tipo: 'contato', x: 1030, y: 170, r: 8 },
  { id: 'f13', label: 'Eduardo N.',       tipo: 'contato', x: 1060, y: 230, r: 8 },
  { id: 'f14', label: '+55 71 9···0001', tipo: 'contato', x: 1080, y: 290, r: 7 },
  { id: 'f15', label: '+55 71 9···0002', tipo: 'contato', x: 1060, y: 350, r: 7 },
  { id: 'f16', label: 'Fábio A.',         tipo: 'contato', x: 1030, y: 400, r: 8 },
]

const EDGES: Edge[] = [
  // Casos entre si
  { from: 'c1', to: 'c2' }, { from: 'c1', to: 'c3' },
  // Suspeitos nos casos
  { from: 'c1', to: 's1', forte: true }, { from: 'c1', to: 's2', forte: true },
  { from: 'c2', to: 's3' }, { from: 'c2', to: 's4' },
  { from: 'c3', to: 's5' },
  { from: 's2', to: 's6' },
  // Dispositivos para suspeitos
  { from: 's1', to: 'd1', forte: true }, { from: 's2', to: 'd2', forte: true },
  { from: 's3', to: 'd3' }, { from: 's4', to: 'd4' },
  // Locais
  { from: 'c1', to: 'l3' }, { from: 's1', to: 'l3' },
  { from: 'c1', to: 'l1' }, { from: 's2', to: 'l1' }, { from: 's6', to: 'l1' },
  { from: 'c2', to: 'l2' }, { from: 's4', to: 'l2' },
  // Hub de contatos
  { from: 'd1', to: 'h1', forte: true }, { from: 'd2', to: 'h1', forte: true },
  { from: 's1', to: 'h1' },
  // Fan do hub
  ...['f1','f2','f3','f4','f5','f6','f7','f8','f9','f10','f11','f12','f13','f14','f15','f16'].map(f => ({ from: 'h1', to: f })),
]

const tipoStyle: Record<Node['tipo'], { fill: string; stroke: string; text: string }> = {
  caso:        { fill: '#f9731622', stroke: '#f97316', text: '#fed7aa' },
  suspeito:    { fill: '#6b728022', stroke: '#6b7280', text: '#d1d5db' },
  dispositivo: { fill: '#3b82f622', stroke: '#3b82f6', text: '#bfdbfe' },
  local:       { fill: '#22c55e22', stroke: '#22c55e', text: '#bbf7d0' },
  contato:     { fill: '#a855f722', stroke: '#a855f7', text: '#e9d5ff' },
}

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

export function CelebbriteMindspace() {
  const navigate = useNavigate()
  const [hover, setHover] = useState<string | null>(null)

  const hoverNode = NODES.find(n => n.id === hover)

  return (
    <div className="flex h-screen bg-[#0d0d1a] text-white overflow-hidden" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Sidebar esquerda */}
      <div className="w-14 bg-[#0a0a18] border-r border-[#1e1e3a] flex flex-col items-center py-4 gap-1 z-10 flex-shrink-0">
        <div className="w-8 h-8 mb-4">
          <svg viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" fill="#1a1a3e" stroke="#4a4aff" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="6" fill="#4a4aff" opacity="0.8" />
            <circle cx="16" cy="16" r="2.5" fill="#fff" />
          </svg>
        </div>
        {menuItems.map((item, i) => (
          <button key={i} title={item.label}
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-base transition-colors ${
              item.label === 'Conexões' ? 'bg-[#4a4aff] text-white' : 'text-[#666] hover:text-[#aaa] hover:bg-[#1a1a2e]'
            }`}>
            {item.icon}
          </button>
        ))}
      </div>

      <div className="flex flex-col flex-1 min-w-0">

        {/* Header */}
        <div className="h-12 bg-[#0a0a18] border-b border-[#1e1e3a] flex items-center px-4 gap-3 flex-shrink-0">
          <span className="text-[#4a4aff] font-bold text-sm tracking-widest uppercase">Cellebrite</span>
          <span className="text-[#666] text-sm">PATHFINDER — Mindspace</span>
          <span className="text-[#333] mx-2">|</span>
          <span className="text-[#888] text-xs">Análise de Vínculos — COPPM/BA</span>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-[10px] text-[#666] border border-[#222] rounded px-2 py-0.5">GrayKey · 1 dispositivo em extração</span>
            <button onClick={() => navigate('/dashboard')}
              className="text-xs text-[#666] hover:text-[#aaa] border border-[#333] rounded px-3 py-1 transition-colors">
              ← Sair do ambiente
            </button>
          </div>
        </div>

        {/* Barra de filtros */}
        <div className="h-10 bg-[#0d0d1a] border-b border-[#1e1e3a] flex items-center px-4 gap-3 text-xs text-[#666] flex-shrink-0">
          <span className="text-[#aaa]">Grafo:</span>
          {['Operação Litoral Sul', 'Profundidade 2', 'Todos os tipos'].map(f => (
            <span key={f} className="bg-[#1a1a2e] border border-[#2a2a4a] text-[#8888cc] px-2 py-0.5 rounded text-[10px]">{f} ×</span>
          ))}
          <div className="ml-auto flex items-center gap-4 text-[10px]">
            {Object.entries(tipoStyle).map(([tipo, s]) => (
              <span key={tipo} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: s.stroke }} />
                <span style={{ color: s.text }} className="capitalize">{tipo}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Canvas do grafo */}
        <div className="flex-1 relative overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 1140 610" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Edges */}
            {EDGES.map((e, i) => {
              const from = NODES.find(n => n.id === e.from)!
              const to   = NODES.find(n => n.id === e.to)!
              const ativo = hover === e.from || hover === e.to
              return (
                <line key={i}
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={ativo ? '#4a4aff' : e.forte ? '#3a3a6a' : '#1e1e3a'}
                  strokeWidth={ativo ? 1.5 : e.forte ? 1 : 0.6}
                  opacity={hover && !ativo ? 0.15 : 1}
                />
              )
            })}

            {/* Nodes */}
            {NODES.map(node => {
              const s = tipoStyle[node.tipo]
              const ativo = hover === node.id
              const connected = EDGES.some(e => e.from === node.id || e.to === node.id
                ? (e.from === hover || e.to === hover) : false)
              const dim = hover && !ativo && !connected

              return (
                <g key={node.id}
                  style={{ cursor: 'pointer', opacity: dim ? 0.25 : 1 }}
                  onMouseEnter={() => setHover(node.id)}
                  onMouseLeave={() => setHover(null)}>
                  {ativo && (
                    <circle cx={node.x} cy={node.y} r={node.r + 8}
                      fill="none" stroke={s.stroke} strokeWidth="1" opacity="0.3"
                      filter="url(#glow)" />
                  )}
                  <circle cx={node.x} cy={node.y} r={node.r}
                    fill={s.fill} stroke={s.stroke}
                    strokeWidth={ativo ? 1.8 : 1}
                    filter={ativo ? 'url(#glow)' : undefined} />
                  {node.r >= 13 && (
                    <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="middle"
                      fontSize={node.r >= 18 ? 8 : 7} fill={s.text} fontWeight="600"
                      style={{ userSelect: 'none', pointerEvents: 'none' }}>
                      {node.label.length > 12 ? node.label.slice(0, 11) + '…' : node.label}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>

          {/* Tooltip */}
          {hoverNode && (
            <div className="absolute bottom-6 left-6 bg-[#0d0d1a]/95 border border-[#2a2a4a] rounded-lg p-3 text-xs pointer-events-none z-10 min-w-[160px]">
              <p className="font-bold" style={{ color: tipoStyle[hoverNode.tipo].stroke }}>{hoverNode.label}</p>
              {hoverNode.sublabel && <p className="text-[#888] mt-0.5">{hoverNode.sublabel}</p>}
              <p className="text-[#444] mt-1 capitalize">Tipo: {hoverNode.tipo}</p>
              <p className="text-[#444]">
                Vínculos: {EDGES.filter(e => e.from === hoverNode.id || e.to === hoverNode.id).length}
              </p>
            </div>
          )}

          {/* Legenda de zoom */}
          <div className="absolute bottom-6 right-6 text-[10px] text-[#333]">
            Passe o mouse sobre um nó para destacar vínculos
          </div>
        </div>
      </div>
    </div>
  )
}
