import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<div>Login</div>} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
        <Route path="/ocorrencias" element={<div>Ocorrências</div>} />
        <Route path="/ocorrencias/nova" element={<div>Nova Ocorrência</div>} />
        <Route path="/ocorrencias/:id" element={<div>Detalhes</div>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
