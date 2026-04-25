import { useState, useEffect, useRef } from 'react'
import { differenceInSeconds, differenceInDays, differenceInWeeks } from 'date-fns'
import type { CountdownValue } from '@/types/task'
import { subscribe } from '@/lib/clock'

function equal(a: CountdownValue, b: CountdownValue): boolean {
  if (a.type !== b.type) return false
  if (a.type === 'countdown' && b.type === 'countdown')
    return a.hours === b.hours && a.minutes === b.minutes && a.seconds === b.seconds
  if (a.type === 'days' && b.type === 'days') return a.days === b.days
  if (a.type === 'weeks' && b.type === 'weeks') return a.weeks === b.weeks
  return true
}

export function useCountdown(deadline: string | null): CountdownValue {
  const deadlineRef = useRef<Date | null>(deadline ? new Date(deadline) : null)

  const compute = (): CountdownValue => {
    if (!deadlineRef.current) return { type: 'no-deadline' }
    const now = new Date()
    const target = deadlineRef.current
    const totalSeconds = differenceInSeconds(target, now)

    if (totalSeconds <= 0) return { type: 'expired' }

    if (totalSeconds < 86400) {
      const h = Math.floor(totalSeconds / 3600)
      const m = Math.floor((totalSeconds % 3600) / 60)
      const s = totalSeconds % 60
      return {
        type: 'countdown',
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0'),
      }
    }

    const weeks = differenceInWeeks(target, now)
    if (weeks >= 1) return { type: 'weeks', weeks }

    const days = differenceInDays(target, now)
    return { type: 'days', days }
  }

  const [value, setValue] = useState<CountdownValue>(() => compute())

  useEffect(() => {
    deadlineRef.current = deadline ? new Date(deadline) : null
    setValue(compute())

    const totalSeconds = deadlineRef.current
      ? differenceInSeconds(deadlineRef.current, new Date())
      : -1

    if (totalSeconds <= 0) return

    return subscribe(() => {
      const next = compute()
      setValue(prev => equal(prev, next) ? prev : next)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadline])

  return value
}
