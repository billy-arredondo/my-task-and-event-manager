import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import { taskKeys } from '@/lib/taskKeys'
import type { Task } from '@/types/task'

export function useTaskActions() {
  const qc = useQueryClient()
  const userId = useAuthStore((s) => s.user?.id)
  const invalidate = () => qc.invalidateQueries({ queryKey: taskKeys.lists() })

  const addMutation = useMutation({
    mutationFn: async (input: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
      const { error } = await supabase.from('tasks').insert({
        user_id: userId,
        description: input.description,
        deadline: input.deadline ?? null,
        priority: input.priority,
        category: input.category,
        completed: false,
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
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await supabase.from('tasks').update({ completed }).eq('id', id)
      if (error) throw error
    },
    onSuccess: invalidate,
  })

  return {
    addTask: (input: Omit<Task, 'id' | 'createdAt' | 'completed'>) => addMutation.mutate(input),
    updateTask: (id: string, input: Omit<Task, 'id' | 'createdAt' | 'completed'>) => updateMutation.mutate({ id, input }),
    deleteTask: (id: string) => deleteMutation.mutate(id),
    toggleComplete: (id: string, completed: boolean) => toggleMutation.mutate({ id, completed }),
  }
}
