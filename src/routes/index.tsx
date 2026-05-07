import { createFileRoute } from '@tanstack/react-router'
import { LandingLayout } from '#/components/landing/landing-layout'
import { LandingNavbar } from '#/components/landing/landing-navbar'
import { LandingFooter } from '#/components/landing/landing-footer'
import { HeroSection } from '#/components/landing/hero-section'
import { FeaturesSection } from '#/components/landing/features-section'
import { AnnouncementsSection } from '#/components/landing/announcements-section'
import { GallerySection } from '#/components/landing/gallery-section'
import { FaqSection } from '#/components/landing/faq-section'
import { CtaSection } from '#/components/landing/cta-section'

export const Route = createFileRoute('/')({
  component: Homepage,
})

function Homepage() {
  return (
    <LandingLayout>
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <AnnouncementsSection />
      <GallerySection />
      <FaqSection />
      <CtaSection />
      <LandingFooter />
    </LandingLayout>
  )
}
