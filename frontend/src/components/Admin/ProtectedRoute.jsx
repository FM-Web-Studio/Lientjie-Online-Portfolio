import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../UI/LoadingSpinner'

export default function ProtectedRoute() {
  const { user, isAdmin, loading } = useAuth()

  if (loading) return <LoadingSpinner fullPage />

  if (!user) return <Navigate to="/admin/login" replace />

  if (!isAdmin) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 16 }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>Access Denied</p>
        <p style={{ color: 'var(--fg-2)', fontSize: '0.9rem' }}>Your account is not authorised to access the admin panel.</p>
      </div>
    )
  }

  return <Outlet />
}
