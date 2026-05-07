import { motion, useScroll, useTransform } from 'motion/react'
import {
  landingStaggerContainer,
  landingStaggerItem,
  landingFadeInUp,
} from '#/lib/motion-presets'
import { cn } from '#/lib/utils'
import { useRef } from 'react'

interface StaggerContainerProps {
  className?: string
  children: React.ReactNode
}

function StaggerContainer({ className, children }: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={landingStaggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  className?: string
  children: React.ReactNode
}

function StaggerItem({ className, children }: StaggerItemProps) {
  return (
    <motion.div variants={landingStaggerItem} className={className}>
      {children}
    </motion.div>
  )
}

interface ParallaxSectionProps {
  speed?: number
  className?: string
  children: React.ReactNode
}

function ParallaxSection({
  speed = 0.3,
  className,
  children,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * -100])

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

interface FadeInUpProps {
  className?: string
  children: React.ReactNode
  delay?: number
}

function FadeInUp({ className, children, delay = 0 }: FadeInUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export { StaggerContainer, StaggerItem, ParallaxSection, FadeInUp }
