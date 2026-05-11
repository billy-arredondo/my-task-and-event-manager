import { useCallback } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Check, RefreshCw } from 'lucide-react'
import { CountdownDisplay } from './CountdownDisplay'
import { useCountdown } from '@/hooks/useCountdown'
import { useTaskActions } from '@/hooks/useTaskActions'
import type { Task } from '@/types/task'

interface Props {
  task: Task
  onClick: (task: Task) => void
}

export function TaskCard({ task, onClick }: Props) {
  const countdown = useCountdown(task.deadline)
  const { toggleComplete } = useTaskActions()

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    toggleComplete(task, !task.completed)
  }, [toggleComplete, task])
  const handleClick = useCallback(() => onClick(task), [onClick, task])

  const priorityBorder = task.completed
    ? 'border-transparent'
    : task.priority === 'high'
      ? 'border-red-200 hover:border-red-500 dark:border-red-900 dark:hover:border-red-500'
      : task.priority === 'medium'
        ? 'border-amber-200 hover:border-amber-400 dark:border-amber-700 dark:hover:border-amber-400'
        : 'border-transparent'

  return (
    <div
      className={`group flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer border-l-4 ${priorityBorder}`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          onClick={handleToggle}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
            task.completed
              ? 'bg-indigo-600 border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500'
              : 'border-slate-300 dark:border-slate-600 group-hover:border-indigo-600 dark:group-hover:border-indigo-400'
          }`}
          aria-label={task.completed ? 'Marcar pendiente' : 'Marcar completada'}
        >
          {task.completed && <Check size={11} className="text-white" strokeWidth={3} />}
        </button>
        <div className="min-w-0 flex flex-col gap-0.5">
          <span
            className={`font-medium text-slate-900 dark:text-slate-100 truncate ${
              task.completed ? 'line-through opacity-40' : ''
            }`}
          >
            {task.description}
          </span>
          {task.deadline && (
            <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
              {format(new Date(task.deadline), 'd MMM, HH:mm', { locale: es })}
              {task.repeatFrequency && (
                <>
                  <RefreshCw size={10} className="text-indigo-400 dark:text-indigo-500 shrink-0" aria-hidden="true" />
                  <span className="text-indigo-400 dark:text-indigo-500">
                    {{ daily: 'Diario', weekday: 'Laborables', weekly: 'Semanal', monthly: 'Mensual', yearly: 'Anual' }[task.repeatFrequency]}
                  </span>
                </>
              )}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 ml-4">
        {!task.completed && <CountdownDisplay value={countdown} />}
      </div>
    </div>
  )
}
