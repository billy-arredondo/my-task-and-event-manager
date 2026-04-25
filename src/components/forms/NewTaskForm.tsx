import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { X, ClipboardList, Calendar } from 'lucide-react'
import { useAddTask } from '@/hooks/useAddTask'
import { useUpdateTask } from '@/hooks/useUpdateTask'
import { Switch } from '@/components/ui/switch'
import type { Priority, Task } from '@/types/task'

interface Props {
  onClose: () => void
  taskToEdit?: Task | null
}

export function NewTaskForm({ onClose, taskToEdit = null }: Props) {
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [hasDeadline, setHasDeadline] = useState(true)
  const [priority, setPriority] = useState<Priority>('medium')
  const [category, setCategory] = useState('Trabajo')
  const addTask = useAddTask()
  const updateTask = useUpdateTask()

  useEffect(() => {
    if (!taskToEdit) {
      setDescription('')
      setDate('')
      setTime('')
      setHasDeadline(true)
      setPriority('medium')
      setCategory('Trabajo')
      return
    }

    setDescription(taskToEdit.description)
    setPriority(taskToEdit.priority ?? 'medium')
    setCategory(taskToEdit.category ?? 'Trabajo')

    if (!taskToEdit.deadline) {
      setHasDeadline(false)
      setDate('')
      setTime('')
      return
    }

    const deadline = new Date(taskToEdit.deadline)
    if (Number.isNaN(deadline.getTime())) {
      setHasDeadline(false)
      setDate('')
      setTime('')
      return
    }

    setHasDeadline(true)
    setDate(format(deadline, 'yyyy-MM-dd'))
    setTime(format(deadline, 'HH:mm'))
  }, [taskToEdit])

  const isEditMode = taskToEdit !== null

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault()
    if (!description.trim()) return
    if (hasDeadline && (!date || !time)) return

    const deadline = hasDeadline
      ? new Date(`${date}T${time}`).toISOString()
      : null

    const payload = { description: description.trim(), deadline, priority, category }

    if (isEditMode) {
      updateTask(taskToEdit.id, payload)
    } else {
      addTask(payload)
    }

    onClose()
  }

  const inputClass =
    'w-full px-4 py-3 bg-[#f8f9ff] dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus-visible:ring-2 focus-visible:ring-indigo-600/20 focus-visible:border-indigo-600 outline-none transition-[border-color,box-shadow] text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400'

  const selectClass =
    'w-full px-4 py-2.5 bg-[#f8f9ff] dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus-visible:border-indigo-600 outline-none appearance-none cursor-pointer'

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-[0_8px_32px_rgba(15,23,42,0.15)] dark:shadow-none dark:border dark:border-slate-700 overflow-hidden">
      <div className="p-7">

        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-surface-container-low dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
              <ClipboardList size={18} className="text-primary-container dark:text-indigo-400" aria-hidden="true" />
            </div>
            <h2
              id="task-form-title"
              className="text-xl font-semibold text-slate-900 dark:text-slate-100"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              {isEditMode ? 'Editar Tarea' : 'Nueva Tarea'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 rounded-md focus-visible:ring-2 focus-visible:ring-indigo-600/40 outline-none"
            aria-label="Cerrar"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Task Name */}
          <div className="space-y-2">
            <label htmlFor="task-description" className="block text-sm font-bold text-slate-700 dark:text-slate-300">
              Evento o tarea
            </label>
            <input
              id="task-description"
              name="description"
              autoComplete="off"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="¿Qué necesitas hacer?…"
              className={inputClass + ' text-base py-3'}
              required
            />
          </div>

          {/* Date & Deadline Section */}
          <div className="space-y-4 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-100 dark:border-slate-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-slate-400" aria-hidden="true" />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Fecha límite
                </span>
              </div>
              <Switch
                checked={hasDeadline}
                onCheckedChange={(v) => setHasDeadline(v)}
                aria-label="Activar fecha límite"
              />
            </div>

            {hasDeadline && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="task-date" className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Fecha
                  </label>
                  <input
                    id="task-date"
                    name="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={selectClass}
                    required={hasDeadline}
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="task-time" className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Hora
                  </label>
                  <input
                    id="task-time"
                    name="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className={selectClass}
                    required={hasDeadline}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Priority + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="task-priority" className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                Prioridad
              </label>
              <select
                id="task-priority"
                name="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className={selectClass}
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="task-category" className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                Categoría
              </label>
              <select
                id="task-category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={selectClass}
              >
                <option>Trabajo</option>
                <option>Personal</option>
                <option>Estudios</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-1">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl text-base font-semibold active:scale-[0.99] transition-[background-color,transform,box-shadow] shadow-md shadow-indigo-200/50 dark:shadow-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600 outline-none"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              {isEditMode ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
