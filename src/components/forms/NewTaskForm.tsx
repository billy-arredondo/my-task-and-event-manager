import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ClipboardList, Calendar } from 'lucide-react'
import { useAddTask } from '@/hooks/useAddTask'
import { Switch } from '@/components/ui/switch'
import type { Priority } from '@/types/task'

export function NewTaskForm() {
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [hasDeadline, setHasDeadline] = useState(true)
  const [priority, setPriority] = useState<Priority>('medium')
  const [category, setCategory] = useState('Trabajo')
  const { mutate: addTask, isPending } = useAddTask()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) return
    if (hasDeadline && (!date || !time)) return

    const deadline = hasDeadline
      ? new Date(`${date}T${time}`).toISOString()
      : null

    addTask(
      { description: description.trim(), deadline, priority, category },
      { onSuccess: () => navigate('/') }
    )
  }

  const inputClass =
    'w-full px-4 py-3 bg-[#f8f9ff] dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400'

  const selectClass =
    'w-full px-4 py-2.5 bg-[#f8f9ff] dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:border-indigo-600 outline-none appearance-none cursor-pointer'

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-start justify-center px-6 py-10">
      <div className="max-w-2xl w-full">

        {/* Form Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-[0_4px_12px_rgba(15,23,42,0.05)] dark:shadow-none dark:border dark:border-slate-700 overflow-hidden">
          <div className="p-8">

            {/* Header */}
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-surface-container-low dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                  <ClipboardList size={20} className="text-primary-container dark:text-indigo-400" />
                </div>
                <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Nueva Tarea
                </h1>
              </div>
              <button
                onClick={() => navigate('/')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Task Name */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                  Evento o tarea
                </label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="¿Qué necesitas hacer?"
                  className={inputClass + ' text-base py-3'}
                  required
                />
              </div>

              {/* Date & Deadline Section */}
              <div className="space-y-4 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-100 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-slate-400" />
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Fecha límite
                    </label>
                  </div>
                  <Switch
                    checked={hasDeadline}
                    onCheckedChange={(v) => setHasDeadline(v)}
                  />
                </div>

                {hasDeadline && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Fecha
                      </span>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={selectClass}
                        required={hasDeadline}
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Hora
                      </span>
                      <input
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
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                    Prioridad
                  </label>
                  <select
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
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                    Categoría
                  </label>
                  <select
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
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl text-xl font-semibold active:scale-[0.99] transition-all shadow-md shadow-indigo-200/50 dark:shadow-none disabled:opacity-50"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>

        <p className="text-center mt-4 text-slate-400 dark:text-slate-500 text-sm">
          La tarea se sincronizará automáticamente con tu calendario.
        </p>
      </div>
    </div>
  )
}
