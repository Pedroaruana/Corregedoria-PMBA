import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

router.use(authMiddleware)

router.get('/', async (_req, res) => {
  try {
    const ocorrencias = await prisma.ocorrencia.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(ocorrencias)
  } catch {
    res.status(500).json({ error: 'Erro ao buscar ocorrências' })
  }
})

router.get('/stats', async (_req, res) => {
  try {
    const todas = await prisma.ocorrencia.findMany({
      select: { status: true, createdAt: true, protocolo: true, bpm: true, policiais: true },
      orderBy: { createdAt: 'desc' },
    })

    const total = todas.length
    const porStatus: Record<string, number> = {}
    todas.forEach(o => {
      porStatus[o.status] = (porStatus[o.status] ?? 0) + 1
    })

    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    const anoAtual = new Date().getFullYear()
    const porMes = meses.map((mes, i) => ({
      mes,
      ocorrencias: todas.filter(o => {
        const d = new Date(o.createdAt)
        return d.getFullYear() === anoAtual && d.getMonth() === i
      }).length,
    }))

    const recentes = todas.slice(0, 5).map(o => ({
      protocolo: o.protocolo,
      status: o.status,
      createdAt: o.createdAt,
    }))

    res.json({ total, porStatus, porMes, recentes })
  } catch {
    res.status(500).json({ error: 'Erro ao buscar estatísticas' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const ocorrencia = await prisma.ocorrencia.findUnique({
      where: { protocolo: decodeURIComponent(req.params.id) },
    })
    if (!ocorrencia) {
      res.status(404).json({ error: 'Ocorrência não encontrada' })
      return
    }
    res.json(ocorrencia)
  } catch {
    res.status(500).json({ error: 'Erro ao buscar ocorrência' })
  }
})

router.post('/', async (req, res) => {
  try {
    const {
      protocolo, dataFato, horaFato, bpm, municipio, bairro, logradouro,
      narrativa, vitimasFatais, feridos, tipoArma, calibre, disparos,
      armaApreendida, policiais,
    } = req.body

    const campos = { protocolo, dataFato, horaFato, bpm, municipio, bairro, logradouro, narrativa, tipoArma, calibre }
    const faltando = Object.entries(campos).filter(([, v]) => !v).map(([k]) => k)
    if (faltando.length > 0) {
      res.status(400).json({ error: `Campos obrigatórios ausentes: ${faltando.join(', ')}` })
      return
    }

    const ocorrencia = await prisma.ocorrencia.create({
      data: {
        protocolo,
        dataFato,
        horaFato,
        bpm,
        municipio,
        bairro,
        logradouro,
        narrativa,
        vitimasFatais: Number(vitimasFatais) || 0,
        feridos: Number(feridos) || 0,
        tipoArma,
        calibre,
        disparos: Number(disparos) || 0,
        armaApreendida: Boolean(armaApreendida),
        policiais: policiais ?? [],
        status: 'Aguardando Assinatura',
      },
    })
    res.status(201).json(ocorrencia)
  } catch {
    res.status(500).json({ error: 'Erro ao criar ocorrência' })
  }
})

router.patch('/:id/assinar', async (req, res) => {
  try {
    const { matricula } = req.body
    const ocorrencia = await prisma.ocorrencia.update({
      where: { protocolo: decodeURIComponent(req.params.id) },
      data: {
        status: 'Concluída',
        assinadoPor: matricula,
        assinadoEm: new Date(),
      },
    })
    res.json(ocorrencia)
  } catch {
    res.status(500).json({ error: 'Erro ao assinar termo' })
  }
})

export { router as ocorrenciasRouter }
