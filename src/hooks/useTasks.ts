import { useState, useEffect, useMemo } from 'react'
import { useTaskStore } from '@/store/taskStore'
import { groupTasks } from '@/lib/utils'

export function useTasks() {
  const tasks = useTaskStore((state) => state.tasks)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000)
    return () => clearInterval(id)
  }, [])

  return useMemo(() => groupTasks(tasks), [tasks, tick])
}
