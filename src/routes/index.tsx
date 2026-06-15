import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { Ocorrencias } from '@/pages/Ocorrencias'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ocorrencias" element={<Ocorrencias />} />
        <Route path="/ocorrencias/nova" element={<div>Nova Ocorrência</div>} />
        <Route path="/ocorrencias/:id" element={<div>Detalhes</div>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
