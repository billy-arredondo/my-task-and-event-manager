import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export function AuthGuard() {
  const session = useAuthStore((s) => s.session)
  if (!session) return <Navigate to="/auth" replace />
  return <Outlet />
}
