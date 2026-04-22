import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { differenceInSeconds, addHours } from 'date-fns'
import type { Task, GroupedTasks } from '@/types/task'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function groupTasks(tasks: Task[]): GroupedTasks {
  const now = new Date()
  const threshold = addHours(now, 24)

  const urgent: Task[] = []
  const later: Task[] = []
  const expired: Task[] = []
  const noDeadline: Task[] = []
  const completed: Task[] = []

  for (const task of tasks) {
    if (task.completed) {
      completed.push(task)
      continue
    }
    if (!task.deadline) {
      noDeadline.push(task)
      continue
    }
    const deadlineDate = new Date(task.deadline)
    const secsRemaining = differenceInSeconds(deadlineDate, now)
    if (secsRemaining <= 0) {
      expired.push(task)
    } else if (deadlineDate < threshold) {
      urgent.push(task)
    } else {
      later.push(task)
    }
  }

  const byDeadline = (a: Task, b: Task) =>
    new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()

  urgent.sort(byDeadline)
  later.sort(byDeadline)
  expired.sort(byDeadline)

  return { urgent, later, expired, noDeadline, completed }
}
