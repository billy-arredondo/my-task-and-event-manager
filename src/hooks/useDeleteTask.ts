import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTaskStore } from '@/store/taskStore'
import { taskKeys } from '@/lib/taskKeys'

export function useDeleteTask() {
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      deleteTask(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
    },
  })
}
