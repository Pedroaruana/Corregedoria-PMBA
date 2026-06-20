import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET ?? 'coppm_secret'

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    res.status(401).json({ error: 'Token não fornecido' })
    return
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    ;(req as Request & { user: unknown }).user = payload
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido' })
  }
}
