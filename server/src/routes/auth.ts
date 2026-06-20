import { Router } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET ?? 'coppm_secret'

export const authRouter = Router()

authRouter.post('/login', (req, res) => {
  const { matricula, senha } = req.body

  if (!matricula || !senha) {
    res.status(400).json({ error: 'Matrícula e senha são obrigatórios' })
    return
  }

  const token = jwt.sign(
    { matricula, nome: `Policial ${matricula}` },
    JWT_SECRET,
    { expiresIn: '8h' }
  )

  res.json({ token, matricula, nome: `Policial ${matricula}` })
})
