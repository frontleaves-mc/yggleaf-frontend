import { forwardRef } from 'react'
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
  hero: 'landing-gradient text-white font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200',
  outline:
    'border-2 border-primary/50 text-primary hover:bg-primary/10 hover:border-primary transition-all duration-200',
  ghost:
    'text-foreground/80 hover:text-foreground hover:bg-muted/50 transition-all duration-200',
}

const landingButtonSizes: Record<LandingButtonSize, string> = {
  default: 'h-10 px-6 text-sm rounded-lg',
  lg: 'h-12 px-8 text-base rounded-xl',
  sm: 'h-8 px-4 text-xs rounded-md',
}

const LandingButton = forwardRef<HTMLButtonElement, LandingButtonProps>(
  (
    { variant = 'hero', size = 'default', className, children, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        data-slot="landing-button"
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          landingButtonVariants[variant],
          landingButtonSizes[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  },
)
LandingButton.displayName = 'LandingButton'

// ─── LandingCard ──────────────────────────────────────

type LandingCardAccent = 'grass' | 'diamond' | 'nether' | 'gold' | 'none'

interface LandingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: LandingCardAccent
}

const accentColors: Record<Exclude<LandingCardAccent, 'none'>, string> = {
  grass: 'bg-mc-grass',
  diamond: 'bg-mc-diamond',
  nether: 'bg-mc-nether',
  gold: 'bg-mc-gold',
}

function LandingCard({
  accent = 'none',
  className,
  children,
  ...props
}: LandingCardProps) {
  return (
    <div
      data-slot="landing-card"
      className={cn(
        'relative overflow-hidden rounded-xl',
        'bg-card/60 backdrop-blur-md border border-border/50',
        'transition-all duration-300',
        'hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1',
        'group/card',
        className,
      )}
      {...props}
    >
      {accent !== 'none' && (
        <div className={cn('h-1 w-full', accentColors[accent])} />
      )}
      {children}
    </div>
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
    <span
      data-slot="landing-badge"
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-medium',
        'border transition-colors',
        badgeVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export { LandingButton, LandingCard, LandingBadge }
