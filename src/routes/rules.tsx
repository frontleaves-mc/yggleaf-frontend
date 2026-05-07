import { createFileRoute } from '@tanstack/react-router'
import { LandingLayout } from '#/components/landing/landing-layout'
import { LandingNavbar } from '#/components/landing/landing-navbar'
import { LandingFooter } from '#/components/landing/landing-footer'
import { LandingSection } from '#/components/landing/landing-section'
import { FadeInUp } from '#/components/landing/landing-animate'
import { MarkdownRenderer } from '#/components/ui/markdown-renderer'
import rulesMd from '#/content/community-rules.md?raw'

export const Route = createFileRoute('/rules')({
  component: RulesPage,
})

function RulesPage() {
  return (
    <LandingLayout>
      <LandingNavbar />
      <main className="pt-16">
        <LandingSection
          title="社区规则"
          subtitle="了解并遵守锋楪社区的基本准则"
        >
          <FadeInUp>
            <div className="mx-auto max-w-4xl rounded-2xl border border-border/50 bg-card p-6 shadow-sm sm:p-10">
              <div
                className="prose prose-sm dark:prose-invert max-w-none
                [&_h1]:font-heading [&_h1]:text-2xl [&_h1]:tracking-tight [&_h1]:mt-8 [&_h1]:mb-4
                [&_h2]:font-heading [&_h2]:text-xl [&_h2]:tracking-tight [&_h2]:mt-6 [&_h2]:mb-3
                [&_h3]:font-heading [&_h3]:text-lg [&_h3]:tracking-tight [&_h3]:mt-5 [&_h3]:mb-2
                [&_p]:leading-relaxed [&_p]:text-[15px] [&_p]:text-muted-foreground
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
              </div>
            </div>
          </FadeInUp>
        </LandingSection>
      </main>
      <LandingFooter />
    </LandingLayout>
  )
}
