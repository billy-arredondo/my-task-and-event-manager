import type { ReactNode } from 'react'
import type { CountdownValue } from '@/types/task'

interface Props {
  value: CountdownValue
}

type CountdownType = CountdownValue['type']

const baseClassName = 'font-medium text-sm'

const countdownRenderers = {
  'no-deadline': {
    className: 'text-slate-400 dark:text-slate-500',
    render: () => 'Sin fecha',
  },
  expired: {
    className: 'text-slate-400 dark:text-slate-500 italic',
    render: () => 'Vencida',
  },
  countdown: {
    className:
      'text-red-600 dark:text-red-300/75 font-mono font-bold bg-error-container/40 dark:bg-red-900/20 px-2 py-1 rounded tabular-nums',
    render: (value: Extract<CountdownValue, { type: 'countdown' }>) =>
      `${value.hours}:${value.minutes}:${value.seconds}`,
  },
  weeks: {
    className: 'text-slate-500 dark:text-slate-400',
    render: (value: Extract<CountdownValue, { type: 'weeks' }>) =>
      (value.weeks === 1 ? '1 semana' : `${value.weeks} semanas`),
  },
  days: {
    className: 'text-slate-500 dark:text-slate-400',
    render: (value: Extract<CountdownValue, { type: 'days' }>) =>
      (value.days === 1 ? '1 día' : `${value.days} días`),
  },
} satisfies {
  [K in CountdownType]: {
    className: string
    render: (value: Extract<CountdownValue, { type: K }>) => ReactNode
  }
}

export function CountdownDisplay({ value }: Props) {
  const renderer = countdownRenderers[value.type]

  return (
    <span className={`${baseClassName} ${renderer.className}`}>
      {renderer.render(value as never)}
    </span>
  )
}
