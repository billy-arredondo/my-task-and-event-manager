import { useTaskStore } from '@/store/taskStore'

export function useTaskActions() {
  return useTaskStore((state) => ({
    addTask: state.addTask,
    deleteTask: state.deleteTask,
    updateTask: state.updateTask,
    toggleComplete: state.toggleComplete,
  }))
}
