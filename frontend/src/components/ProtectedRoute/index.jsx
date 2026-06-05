import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks'

export default function ProtectedRoute() {
  const { user, isAdmin, loading } = useAuth()

  if (loading) return null

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
