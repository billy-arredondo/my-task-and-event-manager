import { useTaskStore } from '@/store/taskStore'

export function useUpdateTask() {
  return useTaskStore((state) => state.updateTask)
}
