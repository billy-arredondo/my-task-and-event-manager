import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task } from '@/types/task'

interface TaskState {
  tasks: Task[]
  addTask: (input: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void
  deleteTask: (id: string) => void
  toggleComplete: (id: string) => void
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (input) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...input,
              id: crypto.randomUUID(),
              completed: false,
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
      toggleComplete: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),
    }),
    { name: 'task-storage' }
  )
)
