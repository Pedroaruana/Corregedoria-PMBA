import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { authRouter } from './routes/auth'
import { ocorrenciasRouter } from './routes/ocorrencias'

const app = express()

app.use(cors({ origin: '*' }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'COPPM/BA API' })
})

app.use('/auth', authRouter)
app.use('/ocorrencias', ocorrenciasRouter)

export default app
