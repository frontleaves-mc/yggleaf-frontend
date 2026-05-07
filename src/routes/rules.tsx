import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { PublicLayout } from '#/components/public/website/public-layout'
import { MarkdownRenderer } from '#/components/ui/markdown-renderer'
import {
  scrollRevealContainer,
  scrollRevealItem,
} from '#/lib/motion-presets'
import rulesMd from '#/content/community-rules.md?raw'

export const Route = createFileRoute('/rules')({
  component: RulesPage,
})

function RulesPage() {
  return (
    <PublicLayout>
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-(--page-max) px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-12 max-w-4xl mx-auto"
            variants={scrollRevealContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.h1
              className="text-center text-4xl font-heading font-bold tracking-tight lg:text-5xl"
              variants={scrollRevealItem}
            >
              社区<span className="gradient-text">规则</span>
            </motion.h1>
          </motion.div>

          <motion.div
            className="mx-auto max-w-4xl rounded-2xl border border-border/50 bg-card p-6 shadow-sm sm:p-10"
            variants={scrollRevealContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.div
              variants={scrollRevealItem}
              className="prose prose-sm dark:prose-invert max-w-none
                [&_h1]:font-heading [&_h1]:text-2xl [&_h1]:tracking-tight [&_h1]:mt-8 [&_h1]:mb-4
                [&_h2]:font-heading [&_h2]:text-xl [&_h2]:tracking-tight [&_h2]:mt-6 [&_h2]:mb-3
                [&_h3]:font-heading [&_h3]:text-lg [&_h3]:tracking-tight [&_h3]:mt-5 [&_h3]:mb-2
                [&_p]:leading-relaxed [&_p]:text-muted-foreground
                [&_ul]:space-y-1.5 [&_ol]:space-y-1.5
                [&_li]:marker:text-muted-foreground
                [&_strong]:text-foreground
                [&_hr]:border-border/60 [&_hr]:my-6
                [&_blockquote]:border-l-primary/30 [&_blockquote]:bg-muted/50 [&_blockquote]:rounded-r-lg
                [&_code]:bg-muted [&_code]:rounded-md [&_code]:px-1.5 [&_code]:py-0.5
                [&_table]:text-sm
                [&_th]:bg-muted [&_th]:font-semibold [&_th]:text-foreground
                [&_td]:border-border [&_a]:text-primary [&_a]:no-underline hover:[&_a]:underline"
            >
              <MarkdownRenderer content={rulesMd} />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  )
}
