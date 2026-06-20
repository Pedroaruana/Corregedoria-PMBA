import jsPDF from 'jspdf'

interface DadosPDF {
  protocolo: string
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
  assinadoPor?: string
  dataAssinatura?: string
}

export function gerarPDFAutoResistencia(dados: DadosPDF) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const margin = 20
  const pageWidth = 210
  const contentWidth = pageWidth - margin * 2
  let y = margin

  const linha = () => {
    doc.setDrawColor(180, 180, 180)
    doc.line(margin, y, pageWidth - margin, y)
    y += 5
  }

  const titulo = (texto: string, size = 10) => {
    doc.setFontSize(size)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(100, 100, 100)
    doc.text(texto.toUpperCase(), margin, y)
    y += 5
  }

  const valor = (texto: string, size = 10) => {
    doc.setFontSize(size)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(30, 30, 30)
    const linhas = doc.splitTextToSize(texto, contentWidth)
    doc.text(linhas, margin, y)
    y += linhas.length * 5 + 2
  }

  const grid = (itens: { label: string; valor: string }[], colunas = 3) => {
    const colWidth = contentWidth / colunas
    const startY = y
    itens.forEach((item, i) => {
      const x = margin + (i % colunas) * colWidth
      const rowY = startY + Math.floor(i / colunas) * 14
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(120, 120, 120)
      doc.text(item.label.toUpperCase(), x, rowY)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(30, 30, 30)
      doc.text(item.valor, x, rowY + 5)
    })
    y = startY + Math.ceil(itens.length / colunas) * 14 + 2
  }

  // ── Cabeçalho ──
  doc.setFillColor(10, 10, 10)
  doc.rect(0, 0, pageWidth, 28, 'F')

  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(160, 160, 160)
  doc.text('ESTADO DA BAHIA', margin, 10)

  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('POLÍCIA MILITAR DA BAHIA', margin, 17)

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(160, 160, 160)
  doc.text('Corregedoria — COPPM/BA', margin, 23)

  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(160, 160, 160)
  doc.text('AUTO DE RESISTÊNCIA', pageWidth - margin, 14, { align: 'right' })
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text(dados.protocolo, pageWidth - margin, 21, { align: 'right' })

  y = 36

  // ── Dados gerais ──
  grid([
    { label: 'Data do fato', valor: dados.dataFato },
    { label: 'Hora', valor: dados.horaFato },
    { label: 'BPM', valor: dados.bpm },
  ])

  titulo('Local da ocorrência')
  valor(dados.local)
  y += 2

  // ── Policiais ──
  titulo('Policiais envolvidos')
  dados.policiais.forEach(p => {
    valor(`${p.patente} ${p.nome}  —  Matrícula: ${p.matricula}`)
  })
  y += 2

  // ── Armamento ──
  grid([
    { label: 'Arma utilizada', valor: `${dados.arma} — ${dados.calibre}` },
    { label: 'Disparos efetuados', valor: String(dados.disparos) },
    { label: 'Arma apreendida', valor: dados.armaApreendida ? 'Sim' : 'Não' },
    { label: 'Vítimas fatais', valor: String(dados.vitimasFatais) },
    { label: 'Feridos', valor: String(dados.feridos) },
  ], 3)

  linha()

  // ── Narrativa ──
  titulo('Narrativa dos fatos')
  valor(dados.narrativa)

  y += 4
  linha()

  // ── Aviso legal ──
  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(120, 120, 120)
  const aviso = 'Ao assinar este termo, o policial declara que as informações prestadas são verídicas e assume responsabilidade legal pelo conteúdo deste Auto de Resistência, conforme Art. 299 do Código Penal Brasileiro.'
  const avisoLinhas = doc.splitTextToSize(aviso, contentWidth)
  doc.text(avisoLinhas, margin, y)
  y += avisoLinhas.length * 4 + 8

  // ── Assinatura ──
  if (dados.assinadoPor) {
    doc.setFillColor(245, 245, 245)
    doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F')

    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(80, 80, 80)
    doc.text('ASSINADO DIGITALMENTE', margin + 6, y + 7)

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(30, 30, 30)
    doc.text(`Matrícula: ${dados.assinadoPor}`, margin + 6, y + 13)
    doc.text(`Data/Hora: ${dados.dataAssinatura ?? ''}`, margin + 6, y + 19)

    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(20, 130, 60)
    doc.text('✓ Assinatura válida', pageWidth - margin - 6, y + 13, { align: 'right' })
  } else {
    doc.setDrawColor(180, 180, 180)
    doc.rect(margin, y, contentWidth / 2 - 5, 20)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text('Assinatura do policial', margin + 4, y + 12)
    y += 24
  }

  // ── Rodapé ──
  const totalPages = 1
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(160, 160, 160)
  doc.text(
    `Documento gerado em ${new Date().toLocaleString('pt-BR')} — COPPM/BA — Página 1 de ${totalPages}`,
    pageWidth / 2,
    295,
    { align: 'center' }
  )

  doc.save(`${dados.protocolo.replace('/', '-')}.pdf`)
}
