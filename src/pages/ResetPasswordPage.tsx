import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Layers, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import { useTheme } from '@/hooks/useTheme'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

export function ResetPasswordPage() {
  useTheme()
  const session = useAuthStore((s) => s.session)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const inputClass =
    'w-full px-4 py-3 bg-[#f8f9ff] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus-visible:ring-2 focus-visible:ring-indigo-600/20 focus-visible:border-indigo-600 outline-none transition-[border-color,box-shadow] text-base text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setDone(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  if (done) return <Navigate to="/" replace />
  if (!session) return <Navigate to="/auth" replace />

  return (
    <div className="min-h-screen bg-[#f8f9ff] dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Layers size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100" style={{ fontFamily: 'Manrope, sans-serif' }}>
            FocusFlow
          </h1>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_8px_32px_rgba(15,23,42,0.10)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.40)] p-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Nueva contraseña
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="new-password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Nueva contraseña
              </label>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
                minLength={6}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirm-password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Confirmar contraseña
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
                minLength={6}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 rounded-lg px-3 py-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-3 rounded-xl text-base font-semibold transition-colors"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              {loading ? 'Cargando…' : 'Guardar nueva contraseña'}
            </button>
          </form>
        </div>
      </div>

      <div className="fixed bottom-6 left-6">
        <ThemeToggle />
      </div>
    </div>
  )
}