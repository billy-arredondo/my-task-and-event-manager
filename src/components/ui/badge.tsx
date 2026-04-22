import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {}

function Badge({ className, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-zinc-700 px-2.5 py-0.5 text-sm font-medium text-zinc-400 dark:border-zinc-700 dark:text-zinc-400 light:border-zinc-300 light:text-zinc-500',
        className
      )}
      {...props}
    />
  )
}

export { Badge }
