import { useTaskStore } from '@/store/taskStore'
import { useShallow } from 'zustand/react/shallow'

export function useTaskActions() {
  return useTaskStore(
    useShallow((state) => ({
      addTask: state.addTask,
      deleteTask: state.deleteTask,
      updateTask: state.updateTask,
      toggleComplete: state.toggleComplete,
    }))
  )
}
