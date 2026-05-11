import { TaskCard } from './TaskCard'
import type { Task } from '@/types/task'

interface Props {
  title: string
  tasks: Task[]
  badgeClass?: string
  onTaskClick: (task: Task) => void
}

export function TaskGroup({
  title,
  tasks,
  badgeClass = 'bg-surface-container-highest text-on-surface-variant dark:bg-slate-700 dark:text-slate-300',
  onTaskClick,
}: Props) {
  if (tasks.length === 0) return null

  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-2xl font-semibold text-on-background dark:text-slate-100" style={{ fontFamily: 'Manrope, sans-serif' }}>
          {title}
        </h2>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
          {tasks.length}
        </span>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-[0px_4px_12px_rgba(15,23,42,0.05)] dark:shadow-none dark:border dark:border-slate-700 overflow-hidden">
        <div>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </div>
      </div>
    </section>
  )
}
