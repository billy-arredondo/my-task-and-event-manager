import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Layers } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import { useTheme } from '@/hooks/useTheme'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

type Mode = 'login' | 'signup'

export function AuthPage() {
  useTheme()
  const session = useAuthStore((s) => s.session)
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  if (session) return <Navigate to="/" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMessage('Revisa tu correo para confirmar tu cuenta.')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-4 py-3 bg-[#f8f9ff] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus-visible:ring-2 focus-visible:ring-indigo-600/20 focus-visible:border-indigo-600 outline-none transition-[border-color,box-shadow] text-base text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500'

  return (
    <div className="min-h-screen bg-[#f8f9ff] dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Layers size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100" style={{ fontFamily: 'Manrope, sans-serif' }}>
            FocusFlow
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_8px_32px_rgba(15,23,42,0.10)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.40)] p-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
            {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="auth-email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Correo electrónico
              </label>
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="auth-password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Contraseña
              </label>
              <input
                id="auth-password"
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
                minLength={6}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {message && (
              <p className="text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 rounded-lg px-3 py-2">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-3 rounded-xl text-base font-semibold transition-colors"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              {loading ? 'Cargando…' : mode === 'login' ? 'Entrar' : 'Registrarse'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); setMessage(null) }}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      </div>

      {/* Theme toggle — bottom-left */}
      <div className="fixed bottom-6 left-6">
        <ThemeToggle />
      </div>
    </div>
  )
}
