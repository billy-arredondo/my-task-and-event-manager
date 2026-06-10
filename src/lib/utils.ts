import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { differenceInSeconds, endOfDay, addDays, addWeeks, addMonths, addYears } from 'date-fns'
import type { Task, GroupedTasks, RepeatFrequency } from '@/types/task'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function groupTasks(tasks: Task[]): GroupedTasks {
  const now = new Date()
  const endOfToday    = endOfDay(now)
  const endOfTomorrow = endOfDay(addDays(now, 1))
  const endOfThisWeek = endOfDay(addDays(now, 6))

  const overdue:    Task[] = []
  const today:      Task[] = []
  const tomorrow:   Task[] = []
  const thisWeek:   Task[] = []
  const later:      Task[] = []
  const noDeadline: Task[] = []
  const completed:  Task[] = []

  for (const task of tasks) {
    if (task.completed) { completed.push(task); continue }
    if (!task.deadline)  { noDeadline.push(task); continue }

    const deadlineDate  = new Date(task.deadline)
    const secsRemaining = differenceInSeconds(deadlineDate, now)

    if (secsRemaining <= 0)                 overdue.push(task)
    else if (deadlineDate <= endOfToday)    today.push(task)
    else if (deadlineDate <= endOfTomorrow) tomorrow.push(task)
    else if (deadlineDate <= endOfThisWeek) thisWeek.push(task)
    else                                    later.push(task)
  }

  const byDeadline = (a: Task, b: Task) =>
    new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()

  overdue.sort(byDeadline)
  today.sort(byDeadline)
  tomorrow.sort(byDeadline)
  thisWeek.sort(byDeadline)
  later.sort(byDeadline)

  return { overdue, today, tomorrow, thisWeek, later, noDeadline, completed }
}

export function computeNextDeadline(deadline: string, frequency: RepeatFrequency, interval: number): string {
  const now = new Date()
  let next = new Date(deadline)
  do {
    switch (frequency) {
      case 'daily':   next = addDays(next, interval); break
      case 'weekday': {
        next = addDays(next, 1)
        const day = next.getDay()
        if (day === 6) next = addDays(next, 2) // Saturday → Monday
        if (day === 0) next = addDays(next, 1) // Sunday → Monday
        break
      }
      case 'weekly':  next = addWeeks(next, interval); break
      case 'monthly': next = addMonths(next, interval); break
      case 'yearly':  next = addYears(next, interval); break
    }
  } while (next <= now)
  return next.toISOString()
}
