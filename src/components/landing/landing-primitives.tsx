import { forwardRef } from 'react'
import { Slot } from 'radix-ui'
import { Badge } from '#/components/ui/badge'
import { Card } from '#/components/ui/card'
import { cn } from '#/lib/utils'

// ─── LandingButton ──────────────────────────────────────

type LandingButtonVariant = 'hero' | 'outline' | 'ghost'
type LandingButtonSize = 'default' | 'lg' | 'sm'

interface LandingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: LandingButtonVariant
  size?: LandingButtonSize
  asChild?: boolean
}

const landingButtonVariants: Record<LandingButtonVariant, string> = {
  hero: 'landing-gradient text-white font-pixel font-medium pixel-border-raised mc-pixel-shadow-sm hover:scale-[1.02] transition-none',
  outline:
    'border-2 border-primary/50 text-primary font-pixel hover:bg-primary/10 hover:border-primary transition-none',
  ghost:
    'text-foreground/80 font-pixel hover:text-foreground hover:bg-muted/50 transition-none',
}

const landingButtonSizes: Record<LandingButtonSize, string> = {
  default: 'h-10 px-6 text-sm rounded-none',
  lg: 'h-12 px-8 text-base rounded-none',
  sm: 'h-8 px-4 text-xs rounded-none',
}

const LandingButton = forwardRef<HTMLButtonElement, LandingButtonProps>(
  (
    {
      variant = 'hero',
      size = 'default',
      asChild = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot.Root : 'button'

    return (
      <Comp
        ref={ref}
        data-slot="landing-button"
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          landingButtonVariants[variant],
          landingButtonSizes[size],
          className,
        )}
        {...props}
      >
        {children}
      </Comp>
    )
  },
)
LandingButton.displayName = 'LandingButton'

// ─── LandingCard ──────────────────────────────────────

type LandingCardAccent = 'grass' | 'diamond' | 'nether' | 'gold' | 'none'

interface LandingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: LandingCardAccent
}

function LandingCard({
  accent = 'none',
  className,
  children,
  ...props
}: LandingCardProps) {
  return (
    <Card
      surface="block"
      accent={accent === 'none' ? 'none' : accent}
      interactive
      className={cn('relative overflow-hidden p-0', className)}
      {...props}
    >
      {children}
    </Card>
  )
}

// ─── LandingBadge ──────────────────────────────────────

type LandingBadgeVariant = 'grass' | 'diamond' | 'nether' | 'gold'

interface LandingBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: LandingBadgeVariant
}

const badgeVariants: Record<LandingBadgeVariant, string> = {
  grass: 'bg-mc-grass/15 text-mc-grass border-mc-grass/30',
  diamond: 'bg-mc-diamond/15 text-mc-diamond border-mc-diamond/30',
  nether: 'bg-mc-nether/15 text-mc-nether border-mc-nether/30',
  gold: 'bg-mc-gold/15 text-mc-gold border-mc-gold/30',
}

function LandingBadge({
  variant = 'grass',
  className,
  children,
  ...props
}: LandingBadgeProps) {
  return (
    <Badge
      data-slot="landing-badge"
      variant={variant}
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium',
        badgeVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </Badge>
  )
}

export { LandingButton, LandingCard, LandingBadge }
