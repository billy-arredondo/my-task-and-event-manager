import { useState, useEffect, useRef } from 'react'
import { differenceInSeconds, differenceInDays, differenceInWeeks } from 'date-fns'
import type { CountdownValue } from '@/types/task'

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

    const interval = totalSeconds < 86400 ? 1000 : 60_000
    const id = setInterval(() => setValue(compute()), interval)
    return () => clearInterval(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadline])

  return value
}
