import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTaskStore } from '@/store/taskStore'
import { taskKeys } from '@/lib/taskKeys'

export function useToggleComplete() {
  const toggleComplete = useTaskStore((state) => state.toggleComplete)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      toggleComplete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
    },
  })
}
