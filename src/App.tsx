import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { AppShell } from '@/components/layout/AppShell'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'

const TaskListPage = lazy(() => import('./pages/TaskListPage').then(m => ({ default: m.TaskListPage })))
const AuthPage = lazy(() => import('./pages/AuthPage').then(m => ({ default: m.AuthPage })))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })))

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setSession, setInitialized, initialized } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setInitialized()
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      if (!session) {
        queryClient.clear()
      } else if (event === 'PASSWORD_RECOVERY') {
        navigate('/auth/reset-password')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!initialized) return null

  return <>{children}</>
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Suspense fallback={<div />}>
              <Routes>
                <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route element={<AuthGuard />}>
                  <Route path="/" element={<AppShell />}>
                    <Route index element={<TaskListPage />} />
                  </Route>
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
