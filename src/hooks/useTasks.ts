import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useTaskStore } from '@/store/taskStore'
import { taskKeys } from '@/lib/taskKeys'
import { groupTasks } from '@/lib/utils'

export function useTasks() {
  const tasks = useTaskStore((state) => state.tasks)
  const queryClient = useQueryClient()

  useEffect(() => {
    queryClient.setQueryData(taskKeys.lists(), groupTasks(tasks))
  }, [tasks, queryClient])

  // Re-group every 60s so tasks migrate between urgent/later/expired in real time
  useEffect(() => {
    const id = setInterval(() => {
      queryClient.setQueryData(taskKeys.lists(), groupTasks(tasks))
    }, 60_000)
    return () => clearInterval(id)
  }, [tasks, queryClient])

  return useQuery({
    queryKey: taskKeys.lists(),
    queryFn: () => groupTasks(tasks),
    initialData: () => groupTasks(tasks),
  })
}
