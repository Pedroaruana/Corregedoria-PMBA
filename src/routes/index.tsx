import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { Ocorrencias } from '@/pages/Ocorrencias'
import { NovaOcorrencia } from '@/pages/NovaOcorrencia'
import { DetalhesOcorrencia } from '@/pages/DetalhesOcorrencia'
import { AssinarTermo } from '@/pages/AssinarTermo'
import { CellebritePathfinder } from '@/pages/CellebritePathfinder'
import { CelebbriteMindspace } from '@/pages/CelebbriteMindspace'
import { LaudosIML } from '@/pages/LaudosIML'
import { ArmasApreendidas } from '@/pages/ArmasApreendidas'
import { ObjetosApreendidos } from '@/pages/ObjetosApreendidos'
import { MainLayout } from '@/layouts/MainLayout'
import { useAuth } from '@/contexts/AuthContext'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ocorrencias" element={<Ocorrencias />} />
          <Route path="/ocorrencias/nova" element={<NovaOcorrencia />} />
          <Route path="/ocorrencias/:id" element={<DetalhesOcorrencia />} />
          <Route path="/ocorrencias/:id/assinar" element={<AssinarTermo />} />
          <Route path="/cellebrite" element={<CellebritePathfinder />} />
          <Route path="/mindspace" element={<CelebbriteMindspace />} />
          <Route path="/consultas/laudos-iml" element={<LaudosIML />} />
          <Route path="/consultas/armas" element={<ArmasApreendidas />} />
          <Route path="/consultas/objetos" element={<ObjetosApreendidos />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
