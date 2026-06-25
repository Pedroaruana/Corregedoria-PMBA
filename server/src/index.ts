import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { authRouter } from './routes/auth'
import { ocorrenciasRouter } from './routes/ocorrencias'

const app = express()
const PORT = process.env.PORT ?? 3333

app.use(cors({ origin: '*' }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'COPPM/BA API' })
})

app.use('/auth', authRouter)
app.use('/ocorrencias', ocorrenciasRouter)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
