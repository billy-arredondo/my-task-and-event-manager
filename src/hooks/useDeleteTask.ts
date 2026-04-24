import { useTaskStore } from '@/store/taskStore'

export function useDeleteTask() {
  return useTaskStore((state) => state.deleteTask)
}
