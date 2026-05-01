import { motion } from 'motion/react'
import { fadeUpItem } from '#/lib/motion-presets'

interface SectionLabelProps {
  label: string
  title: string
  actions?: React.ReactNode
}

export function SectionLabel({ label, title, actions }: SectionLabelProps) {
  return (
    <motion.div
      variants={fadeUpItem}
      className="flex items-end justify-between gap-4"
    >
      <div>
        <p className="mb-0.5 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
          {label}
        </p>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h2>
      </div>
      {actions}
    </motion.div>
  )
}
