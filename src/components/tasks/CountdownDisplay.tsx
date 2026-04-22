import type { CountdownValue } from '@/types/task'

interface Props {
  value: CountdownValue
}

export function CountdownDisplay({ value }: Props) {
  if (value.type === 'no-deadline') {
    return (
      <span className="text-slate-400 dark:text-slate-500 font-medium text-sm">
        Sin fecha
      </span>
    )
  }
  if (value.type === 'expired') {
    return (
      <span className="text-slate-400 dark:text-slate-500 font-medium text-sm italic">
        Vencida
      </span>
    )
  }
  if (value.type === 'countdown') {
    return (
      <span className="text-red-700 dark:text-red-400 font-mono font-bold text-sm bg-[#ffdad6]/40 dark:bg-red-900/20 px-2 py-1 rounded tabular-nums">
        {value.hours}:{value.minutes}:{value.seconds}
      </span>
    )
  }
  if (value.type === 'weeks') {
    return (
      <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">
        {value.weeks === 1 ? '1 semana' : `${value.weeks} semanas`}
      </span>
    )
  }
  return (
    <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">
      {value.days === 1 ? '1 día' : `${value.days} días`}
    </span>
  )
}
