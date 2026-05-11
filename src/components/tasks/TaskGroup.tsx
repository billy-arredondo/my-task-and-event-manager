import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { TaskCard } from './TaskCard'
import type { Task } from '@/types/task'

interface Props {
  title: string
  tasks: Task[]
  badgeClass?: string
  onTaskClick: (task: Task) => void
  collapsible?: boolean
  defaultCollapsed?: boolean
}

export function TaskGroup({
  title,
  tasks,
  badgeClass = 'bg-surface-container-highest text-on-surface-variant dark:bg-slate-700 dark:text-slate-300',
  onTaskClick,
  collapsible = false,
  defaultCollapsed = false,
}: Props) {
  const [open, setOpen] = useState(!defaultCollapsed)

  if (tasks.length === 0) return null

  return (
    <section className="mb-8">
      {collapsible ? (
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center gap-3 mb-4 cursor-pointer group"
        >
          <h2 className="text-2xl font-semibold text-on-background dark:text-slate-100 flex-1 text-left" style={{ fontFamily: 'Manrope, sans-serif' }}>
            {title}
          </h2>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
            {tasks.length}
          </span>
          <ChevronDown
            size={20}
            className="text-slate-400 transition-transform duration-300 flex-shrink-0"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>
      ) : (
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-2xl font-semibold text-on-background dark:text-slate-100" style={{ fontFamily: 'Manrope, sans-serif' }}>
            {title}
          </h2>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
            {tasks.length}
          </span>
        </div>
      )}
      {collapsible ? (
        <div
          className="grid transition-[grid-template-rows] duration-300 ease-in-out"
          style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-[0px_4px_12px_rgba(15,23,42,0.05)] dark:shadow-none dark:border dark:border-slate-700 overflow-hidden">
              <div>
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} onClick={onTaskClick} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-[0px_4px_12px_rgba(15,23,42,0.05)] dark:shadow-none dark:border dark:border-slate-700 overflow-hidden">
          <div>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onClick={onTaskClick} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
