import { useState, useEffect } from 'react'
import { Outlet, Link } from 'react-router-dom'
import {
  LayoutGrid, CheckCircle, Calendar, BarChart3,
  Bell, Settings, Search, Plus, HelpCircle,
  LogOut, Home, ListChecks, Timer, User, Layers,
} from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { useTheme } from '@/hooks/useTheme'
import { NewTaskForm } from '@/components/forms/NewTaskForm'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import type { Task } from '@/types/task'

export interface AppShellOutletContext {
  openEditTaskModal: (task: Task) => void
}

export function AppShell() {
  useTheme()
  const user = useAuthStore((s) => s.user)
  const [newTaskOpen, setNewTaskOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)

  const handleLogout = () => supabase.auth.signOut()

  const closeTaskModal = () => {
    setNewTaskOpen(false)
    setTaskToEdit(null)
  }

  const openNewTaskModal = () => {
    setTaskToEdit(null)
    setNewTaskOpen(true)
  }

  const openEditTaskModal = (task: Task) => {
    setTaskToEdit(task)
    setNewTaskOpen(true)
  }

  useEffect(() => {
    if (!newTaskOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeTaskModal() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [newTaskOpen])

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-on-surface dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">

      {/* Fixed Top Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">

          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100" style={{ fontFamily: 'Manrope, sans-serif' }}>
              FocusFlow
            </Link>
            <nav className="hidden md:flex gap-8">
              <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors text-sm font-medium">
                Dashboard
              </a>
              <Link to="/" className="text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400 text-sm pb-0.5">
                Tasks
              </Link>
              <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors text-sm font-medium">
                Calendar
              </a>
              <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors text-sm font-medium">
                Analytics
              </a>
            </nav>
          </div>

          {/* Right: Search + Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-1.5 gap-2">
              <Search size={16} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Buscar..."
                className="bg-transparent border-none focus:outline-none text-sm w-40 text-slate-700 dark:text-slate-300 placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <Bell size={20} />
              </button>
              <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <Settings size={20} />
              </button>
            </div>
            <button
              onClick={openNewTaskModal}
              className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors active:scale-[0.98]"
            >
              <Plus size={16} aria-hidden="true" />
              Nueva tarea
            </button>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 p-4 pt-20 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 z-40">
        <div className="mb-8 px-2">
          <div className="flex items-center gap-3 p-2">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white">
              <Layers size={16} />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-none" style={{ fontFamily: 'Manrope, sans-serif' }}>
                FocusFlow
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate block max-w-37">
                {user?.email}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:translate-x-0.5 transition-all rounded-md font-medium text-sm">
            <LayoutGrid size={18} />
            Dashboard
          </a>
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm rounded-md font-medium text-sm">
            <CheckCircle size={18} />
            Tasks
          </Link>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:translate-x-0.5 transition-all rounded-md font-medium text-sm">
            <Calendar size={18} />
            Calendar
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:translate-x-0.5 transition-all rounded-md font-medium text-sm">
            <BarChart3 size={18} />
            Analytics
          </a>
        </nav>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-1">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all rounded-md font-medium text-sm">
            <HelpCircle size={18} />
            Help
          </a>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all rounded-md font-medium text-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 pt-20 pb-24 md:pb-8 min-h-screen">
        <Outlet context={{ openEditTaskModal } satisfies AppShellOutletContext} />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 lg:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-[0_-4px_12px_rgba(15,23,42,0.05)]">
        <a href="#" className="flex flex-col items-center text-slate-400 dark:text-slate-500 active:scale-95 transition-transform">
          <Home size={22} />
          <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Home</span>
        </a>
        <Link to="/" className="flex flex-col items-center text-indigo-600 dark:text-indigo-400 active:scale-95 transition-transform">
          <ListChecks size={22} />
          <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Tasks</span>
        </Link>
        <a href="#" className="flex flex-col items-center text-slate-400 dark:text-slate-500 active:scale-95 transition-transform">
          <Timer size={22} />
          <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Focus</span>
        </a>
        <a href="#" className="flex flex-col items-center text-slate-400 dark:text-slate-500 active:scale-95 transition-transform">
          <User size={22} />
          <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Profile</span>
        </a>
      </nav>

      {/* Mobile FAB */}
      <button
        onClick={openNewTaskModal}
        className="fixed bottom-24 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg lg:hidden active:scale-95 transition-transform z-50"
        aria-label="Nueva tarea"
      >
        <Plus size={24} aria-hidden="true" />
      </button>

      {/* New Task Modal */}
      {newTaskOpen && (
        <>
          <div
            className="fixed inset-0 z-60 bg-slate-900/50 backdrop-blur-sm"
            aria-hidden="true"
            onClick={closeTaskModal}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-form-title"
            className="fixed inset-0 z-70 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-xl overscroll-contain">
              <NewTaskForm onClose={closeTaskModal} taskToEdit={taskToEdit} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
