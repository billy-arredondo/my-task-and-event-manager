import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTaskStore } from '@/store/taskStore'
import { taskKeys } from '@/lib/taskKeys'
import type { Task } from '@/types/task'

export function useAddTask() {
  const addTask = useTaskStore((state) => state.addTask)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
      addTask(input)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
    },
  })
}
