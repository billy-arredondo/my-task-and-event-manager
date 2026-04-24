import { useCallback } from 'react'
import { Check, Trash2, ChevronRight } from 'lucide-react'
import { CountdownDisplay } from './CountdownDisplay'
import { useCountdown } from '@/hooks/useCountdown'
import { useDeleteTask } from '@/hooks/useDeleteTask'
import { useToggleComplete } from '@/hooks/useToggleComplete'
import type { Task } from '@/types/task'

interface Props {
  task: Task
}

export function TaskCard({ task }: Props) {
  const countdown = useCountdown(task.deadline)
  const deleteTask = useDeleteTask()
  const toggleComplete = useToggleComplete()

  const handleToggle = useCallback(() => toggleComplete(task.id), [toggleComplete, task.id])
  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    deleteTask(task.id)
  }, [deleteTask, task.id])

  return (
    <div className="group flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
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
        <span
          className={`font-medium text-slate-900 dark:text-slate-100 truncate ${
            task.completed ? 'line-through opacity-40' : ''
          }`}
        >
          {task.description}
        </span>
      </div>

      <div className="flex items-center gap-3 shrink-0 ml-4">
        {!task.completed && <CountdownDisplay value={countdown} />}

        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400"
          aria-label="Eliminar"
        >
          <Trash2 size={15} />
        </button>

        <ChevronRight
          size={18}
          className="text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </div>
    </div>
  )
}
