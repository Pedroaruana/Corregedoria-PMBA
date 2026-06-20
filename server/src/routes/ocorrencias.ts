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
    const ocorrencia = await prisma.ocorrencia.create({ data: req.body })
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
