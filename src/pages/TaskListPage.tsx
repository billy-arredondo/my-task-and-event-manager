import { useOutletContext } from 'react-router-dom'
import { TaskList } from '@/components/tasks/TaskList'
import type { AppShellOutletContext } from '@/components/layout/AppShell'

export function TaskListPage() {
  const { openEditTaskModal } = useOutletContext<AppShellOutletContext>()

  return <TaskList onTaskClick={openEditTaskModal} />
}
