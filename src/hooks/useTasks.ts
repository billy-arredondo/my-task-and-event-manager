import { useQuery } from '@tanstack/react-query'
import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { groupTasks } from '@/lib/utils'
import { taskKeys } from '@/lib/taskKeys'
import type { Task } from '@/types/task'

async function fetchTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error

  return data.map((row) => ({
    id: row.id ?? '',
    description: row.description ?? '',
    deadline: row.deadline ?? null,
    completed: row.completed ?? false,
    priority: (row.priority ?? undefined) as Task['priority'],
    category: row.category ?? undefined,
    createdAt: row.created_at ?? '',
    repeatFrequency: (row.repeat_frequency ?? null) as Task['repeatFrequency'],
    repeatInterval: row.repeat_interval ?? null,
  }))
}

export function useTasks() {
  const { data: tasks = [] } = useQuery({
    queryKey: taskKeys.lists(),
    queryFn: fetchTasks,
  })

  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000)
    return () => clearInterval(id)
  }, [])

  return useMemo(() => groupTasks(tasks), [tasks, tick])
}
