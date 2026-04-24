import { useTaskStore } from '@/store/taskStore'

export function useAddTask() {
  return useTaskStore((state) => state.addTask)
}
