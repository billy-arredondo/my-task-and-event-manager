import { useMemo } from 'react'
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import { useTasks } from '@/hooks/useTasks'
import { TaskGroup } from './TaskGroup'
import type { Task } from '@/types/task'

interface Props {
  onTaskClick: (task: Task) => void
}

export function TaskList({ onTaskClick }: Props) {
  const grouped = useTasks()

  const totalTasks = useMemo(
    () => grouped.urgent.length + grouped.later.length + grouped.expired.length + grouped.noDeadline.length,
    [grouped]
  )
  const completedCount = useMemo(() => grouped.completed.length, [grouped])
  const completionPct = useMemo(
    () => totalTasks + completedCount > 0
      ? Math.round((completedCount / (totalTasks + completedCount)) * 100)
      : 0,
    [totalTasks, completedCount]
  )
  const hasAnyTask = useMemo(() => totalTasks > 0 || completedCount > 0, [totalTasks, completedCount])

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-8">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-on-background dark:text-slate-100 tracking-tight mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Mis Tareas
          </h1>
          <p className="text-secondary dark:text-slate-400 text-base">
            Organiza tu flujo de trabajo y mantén el enfoque.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <SlidersHorizontal size={16} />
            Filtrar
          </button>
          <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <ArrowUpDown size={16} />
            Ordenar
          </button>
        </div>
      </div>

      {!hasAnyTask && (
        <div className="text-center py-20">
          <p className="text-slate-400 dark:text-slate-500 text-lg">
            No hay tareas. ¡Añade una!
          </p>
        </div>
      )}

      <TaskGroup
        title="Menos de 24 horas"
        tasks={grouped.urgent}
        badgeClass="bg-[#ffdad6] text-[#93000a] dark:bg-red-900/30 dark:text-red-300"
        onTaskClick={onTaskClick}
      />
      <TaskGroup
        title="Más de 24 horas"
        tasks={grouped.later}
        badgeClass="bg-surface-container-highest text-on-surface-variant dark:bg-slate-700 dark:text-slate-300"
        onTaskClick={onTaskClick}
      />
      <TaskGroup
        title="Vencidas"
        tasks={grouped.expired}
        badgeClass="bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
        onTaskClick={onTaskClick}
      />
      <TaskGroup
        title="Sin fecha"
        tasks={grouped.noDeadline}
        badgeClass="bg-surface-container text-secondary dark:bg-slate-700 dark:text-slate-400"
        onTaskClick={onTaskClick}
      />
      <TaskGroup
        title="Completadas"
        tasks={grouped.completed}
        badgeClass="bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
        onTaskClick={onTaskClick}
      />

      {/* Progress Card */}
      {hasAnyTask && (
        <div className="mt-12 p-8 rounded-3xl bg-indigo-600 text-white flex items-center justify-between overflow-hidden relative">
          <div className="z-10 max-w-md">
            <h3 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {completionPct >= 80 ? '¡Casi terminas!' : '¡Sigue adelante!'}
            </h3>
            <p className="text-indigo-100 mb-6">
              {completedCount > 0
                ? `Has completado ${completionPct}% de tus tareas. Mantén el ritmo y finaliza tus pendientes.`
                : 'Organiza tu flujo de trabajo y mantén el enfoque en tus objetivos.'}
            </p>
            <div className="w-full bg-indigo-900/30 rounded-full h-2 mb-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionPct || 5}%` }}
              />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
              Progreso Diario
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
