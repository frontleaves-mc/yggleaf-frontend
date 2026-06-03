import * as React from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '#/lib/utils'

const badgeVariants = cva(
  'group/badge inline-flex h-5.5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-none border-2 px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 pixel-border-raised has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [a]:hover:bg-primary/80',
        grass: 'bg-mc-grass text-white [a]:hover:bg-mc-grass/80',
        diamond: 'bg-mc-diamond text-white [a]:hover:bg-mc-diamond/80',
        nether: 'bg-mc-nether text-white [a]:hover:bg-mc-nether/80',
        gold: 'bg-mc-gold text-mc-dark [a]:hover:bg-mc-gold/80',
        secondary:
          'bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80',
        destructive:
          'bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20',
        outline:
          'bg-input/20 text-foreground dark:bg-input/30 [a]:hover:bg-muted [a]:hover:text-muted-foreground',
        ghost:
          'border-transparent hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50',
        link: 'border-transparent text-primary underline-offset-4 hover:underline',
        success:
          'bg-chart-1/15 text-chart-3 [a]:hover:bg-chart-1/25 dark:bg-chart-1/20 dark:text-chart-2',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span'

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
