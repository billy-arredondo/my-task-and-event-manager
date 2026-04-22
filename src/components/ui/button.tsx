import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-300',
        destructive:
          'bg-red-500 text-white hover:bg-red-600',
        ghost:
          'hover:bg-zinc-800 hover:text-zinc-100 dark:hover:bg-zinc-800',
        outline:
          'border border-zinc-700 bg-transparent hover:bg-zinc-800 hover:text-zinc-100 dark:border-zinc-700',
      },
      size: {
        default: 'h-11 px-5 py-2',
        sm: 'h-8 px-3 text-sm',
        lg: 'h-13 px-8 text-xl',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
