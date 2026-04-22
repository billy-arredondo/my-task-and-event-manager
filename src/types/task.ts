export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  description: string
  deadline: string | null
  completed: boolean
  createdAt: string
  priority?: Priority
  category?: string
}

export type CountdownValue =
  | { type: 'countdown'; hours: string; minutes: string; seconds: string }
  | { type: 'days'; days: number }
  | { type: 'weeks'; weeks: number }
  | { type: 'expired' }
  | { type: 'no-deadline' }

export interface GroupedTasks {
  urgent: Task[]
  later: Task[]
  expired: Task[]
  noDeadline: Task[]
  completed: Task[]
}
