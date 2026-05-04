import { useEffect, useState, useCallback } from 'react'
import { format } from 'date-fns'
import { X, ClipboardList, Calendar, Trash2, RefreshCw } from 'lucide-react'
import { useTaskActions } from '@/hooks/useTaskActions'
import { Switch } from '@/components/ui/switch'
import type { Priority, RepeatFrequency, Task } from '@/types/task'

interface Props {
  onClose: () => void
  taskToEdit?: Task | null
}

export function NewTaskForm({ onClose, taskToEdit = null }: Props) {
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [hasDeadline, setHasDeadline] = useState(true)
  const [hasRepeat, setHasRepeat] = useState(false)
  const [repeatFrequency, setRepeatFrequency] = useState<RepeatFrequency>('weekly')
  const [repeatInterval, setRepeatInterval] = useState(1)
  const [priority, setPriority] = useState<Priority>('medium')
  const [category, setCategory] = useState('Trabajo')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { addTask, updateTask, deleteTask } = useTaskActions()

  const handleDelete = () => {
    if (taskToEdit) {
      deleteTask(taskToEdit.id)
      onClose()
    }
  }

  useEffect(() => {
    if (!taskToEdit) {
      setDescription('')
      setDate('')
      setTime('')
      setHasDeadline(true)
      setHasRepeat(false)
      setRepeatFrequency('weekly')
      setRepeatInterval(1)
      setPriority('medium')
      setCategory('Trabajo')
      return
    }

    setDescription(taskToEdit.description)
    setPriority(taskToEdit.priority ?? 'medium')
    setCategory(taskToEdit.category ?? 'Trabajo')
    setHasRepeat(!!taskToEdit.repeatFrequency)
    setRepeatFrequency(taskToEdit.repeatFrequency ?? 'weekly')
    setRepeatInterval(taskToEdit.repeatInterval ?? 1)

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
  const isTouchDevice = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(hover: none)').matches
    : false

  const handleSubmit = useCallback(async (e: { preventDefault(): void }) => {
    e.preventDefault()
    if (!description.trim()) return
    if (hasDeadline && (!date || !time)) return

    const deadline = hasDeadline
      ? new Date(`${date}T${time}`).toISOString()
      : null

    const payload = {
      description: description.trim(),
      deadline,
      priority,
      category,
      repeatFrequency: hasDeadline && hasRepeat ? repeatFrequency : null,
      repeatInterval: hasDeadline && hasRepeat ? repeatInterval : null,
    }

    try {
      setSubmitError(null)
      if (isEditMode) {
        await updateTask(taskToEdit.id, payload)
      } else {
        await addTask(payload)
      }
      onClose()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error al guardar la tarea')
    }
  }, [description, hasDeadline, hasRepeat, repeatFrequency, repeatInterval, date, time, priority, category, isEditMode, taskToEdit, addTask, updateTask, onClose])

  const inputClass =
    'w-full px-4 py-3 bg-[#f8f9ff] dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus-visible:ring-2 focus-visible:ring-indigo-600/20 focus-visible:border-indigo-600 outline-none transition-[border-color,box-shadow] text-base text-slate-700 dark:text-slate-200 placeholder:text-slate-400'

  const selectClass =
    'w-full px-4 py-2.5 bg-[#f8f9ff] dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-base text-slate-700 dark:text-slate-200 focus-visible:border-indigo-600 outline-none appearance-none cursor-pointer'

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
              autoFocus={!isTouchDevice}
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
                onCheckedChange={(v) => { setHasDeadline(v); if (!v) setHasRepeat(false) }}
                aria-label="Activar fecha límite"
              />
            </div>

            {hasDeadline && (
              <>
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

                <div className="border-t border-slate-200 dark:border-slate-600 pt-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <RefreshCw size={15} className="text-slate-400" aria-hidden="true" />
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Repetir</span>
                    </div>
                    <Switch
                      checked={hasRepeat}
                      onCheckedChange={setHasRepeat}
                      aria-label="Activar repetición"
                    />
                  </div>

                  {hasRepeat && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label htmlFor="task-repeat-interval" className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Cada
                        </label>
                        <input
                          id="task-repeat-interval"
                          type="number"
                          min={1}
                          value={repeatInterval}
                          onChange={(e) => setRepeatInterval(Math.max(1, Number(e.target.value)))}
                          className={selectClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="task-repeat-frequency" className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Frecuencia
                        </label>
                        <select
                          id="task-repeat-frequency"
                          value={repeatFrequency}
                          onChange={(e) => setRepeatFrequency(e.target.value as RepeatFrequency)}
                          className={selectClass}
                        >
                          <option value="daily">Día(s)</option>
                          <option value="weekly">Semana(s)</option>
                          <option value="monthly">Mes(es)</option>
                          <option value="yearly">Año(s)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </>
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
          <div className="pt-1 space-y-3">
            {submitError && (
              <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                {submitError}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl text-base font-semibold active:scale-[0.99] transition-[background-color,transform,box-shadow] shadow-md shadow-indigo-200/50 dark:shadow-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600 outline-none"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              {isEditMode ? 'Actualizar' : 'Guardar'}
            </button>

            {isEditMode && (
              <button
                type="button"
                onClick={handleDelete}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-base font-semibold text-indigo-600 border border-indigo-600 hover:bg-indigo-50 dark:border-indigo-500 dark:text-indigo-400 dark:hover:bg-indigo-900/20 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/40"
              >
                <Trash2 size={15} />
                Eliminar tarea
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
