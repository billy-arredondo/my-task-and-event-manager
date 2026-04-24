import { useTaskStore } from '@/store/taskStore'

export function useToggleComplete() {
  return useTaskStore((state) => state.toggleComplete)
}
