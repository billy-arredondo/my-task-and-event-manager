import { useMemo, useState } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { TaskGroup } from './TaskGroup'
import type { Task, Priority } from '@/types/task'

interface Props {
  onTaskClick: (task: Task) => void
}

const PRIORITY_FILTERS: { label: string; value: Priority | null }[] = [
  { label: 'Todas', value: null },
  { label: 'Alta', value: 'high' },
  { label: 'Media', value: 'medium' },
  { label: 'Baja', value: 'low' },
]

export function TaskList({ onTaskClick }: Props) {
  const grouped = useTasks()
  const [filterPriority, setFilterPriority] = useState<Priority | null>(null)

  const filtered = useMemo(() => {
    if (!filterPriority) return grouped
    const keep = (tasks: Task[]) => tasks.filter(t => t.priority === filterPriority)
    return {
      ...grouped,
      overdue: keep(grouped.overdue),
      today: keep(grouped.today),
      tomorrow: keep(grouped.tomorrow),
      thisWeek: keep(grouped.thisWeek),
      later: keep(grouped.later),
      noDeadline: keep(grouped.noDeadline),
    }
  }, [grouped, filterPriority])

  const totalTasks = useMemo(
    () =>
      grouped.overdue.length +
      grouped.today.length +
      grouped.tomorrow.length +
      grouped.thisWeek.length +
      grouped.later.length +
      grouped.noDeadline.length,
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
          {PRIORITY_FILTERS.map(({ label, value }) => (
            <button
              key={label}
              onClick={() => setFilterPriority(value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterPriority === value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
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
        title="Vencidas"
        tasks={filtered.overdue}
        badgeClass="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
        onTaskClick={onTaskClick}
      />
      <TaskGroup
        title="Hoy"
        tasks={filtered.today}
        badgeClass="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
        onTaskClick={onTaskClick}
      />
      <TaskGroup
        title="Mañana"
        tasks={filtered.tomorrow}
        badgeClass="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
        onTaskClick={onTaskClick}
      />
      <TaskGroup
        title="Esta semana"
        tasks={filtered.thisWeek}
        badgeClass="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
        onTaskClick={onTaskClick}
      />
      <TaskGroup
        title="Más adelante"
        tasks={filtered.later}
        badgeClass="bg-surface-container-highest text-on-surface-variant dark:bg-slate-700 dark:text-slate-300"
        onTaskClick={onTaskClick}
      />
      <TaskGroup
        title="Sin fecha"
        tasks={filtered.noDeadline}
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
        <div className="mt-12 p-8 rounded-3xl border-2 border-indigo-600 text-indigo-600 flex items-center justify-between overflow-hidden relative">
          <div className="z-10 max-w-md">
            <h3 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {completionPct >= 80 ? '¡Casi terminas!' : '¡Sigue adelante!'}
            </h3>
            <p className="text-indigo-400 mb-6">
              {completedCount > 0
                ? `Has completado ${completionPct}% de tus tareas. Mantén el ritmo y finaliza tus pendientes.`
                : 'Organiza tu flujo de trabajo y mantén el enfoque en tus objetivos.'}
            </p>
            <div className="w-full bg-indigo-100 rounded-full h-2 mb-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionPct || 5}%` }}
              />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Progreso General
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
