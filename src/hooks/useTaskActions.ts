import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import { taskKeys } from '@/lib/taskKeys'
import { computeNextDeadline } from '@/lib/utils'
import type { Task } from '@/types/task'

export function useTaskActions() {
  const qc = useQueryClient()
  const userId = useAuthStore((s) => s.user?.id)
  const invalidate = () => qc.invalidateQueries({ queryKey: taskKeys.lists() })

  const addMutation = useMutation({
    mutationFn: async (input: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
      if (!userId) throw new Error('Not authenticated')
      const { error } = await supabase.from('tasks').insert({
        user_id: userId,
        description: input.description,
        deadline: input.deadline ?? null,
        priority: input.priority,
        category: input.category,
        completed: false,
        repeat_frequency: input.repeatFrequency ?? null,
        repeat_interval: input.repeatInterval ?? null,
      })
      if (error) throw error
    },
    onSuccess: invalidate,
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Omit<Task, 'id' | 'createdAt' | 'completed'> }) => {
      const { error } = await supabase.from('tasks').update({
        description: input.description,
        deadline: input.deadline ?? null,
        priority: input.priority,
        category: input.category,
        repeat_frequency: input.repeatFrequency ?? null,
        repeat_interval: input.repeatInterval ?? null,
      }).eq('id', id)
      if (error) throw error
    },
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tasks').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: invalidate,
  })

  const toggleMutation = useMutation({
    mutationFn: async ({ task, completed }: { task: Task; completed: boolean }) => {
      const { error } = await supabase.from('tasks').update({ completed }).eq('id', task.id)
      if (error) throw error

      if (completed && task.repeatFrequency && task.deadline) {
        const nextDeadline = computeNextDeadline(task.deadline, task.repeatFrequency, task.repeatInterval ?? 1)
        const { error: insertError } = await supabase.from('tasks').insert({
          user_id: userId,
          description: task.description,
          deadline: nextDeadline,
          priority: task.priority,
          category: task.category,
          repeat_frequency: task.repeatFrequency,
          repeat_interval: task.repeatInterval ?? 1,
          completed: false,
        })
        if (insertError) throw insertError
      }
    },
    onSuccess: invalidate,
  })

  return {
    addTask: (input: Omit<Task, 'id' | 'createdAt' | 'completed'>) => addMutation.mutateAsync(input),
    updateTask: (id: string, input: Omit<Task, 'id' | 'createdAt' | 'completed'>) => updateMutation.mutateAsync({ id, input }),
    deleteTask: (id: string) => deleteMutation.mutate(id),
    toggleComplete: (task: Task, completed: boolean) => toggleMutation.mutate({ task, completed }),
  }
}
