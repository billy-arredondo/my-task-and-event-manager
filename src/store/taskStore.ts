import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task } from '@/types/task'

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

interface TaskState {
  tasks: Task[]
  addTask: (input: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void
  updateTask: (id: string, input: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void
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
              id: generateId(),
              completed: false,
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      updateTask: (id, input) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                ...task,
                ...input,
              }
              : task
          ),
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
