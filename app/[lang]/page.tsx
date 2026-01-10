import { setI18n } from '@lingui/react/server'
import { getI18nInstance } from '@/locale/server'
import Navbar from './(site)/navbar'
import Hero from './(site)/hero'
import Features from './(site)/features'
import Pricing from './(site)/pricing'
import Testimonials from './(site)/testimonials'
import FAQ from './(site)/faq'
import CTA from './(site)/cta'
import Footer from './(site)/footer'
import { GridLayout, SectionDivider } from './(site)/grid-layout'

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const i18n = getI18nInstance(lang)
  setI18n(i18n)

  return (
    <GridLayout>
      <Navbar />
      <Hero />
      <SectionDivider />
      <Features />
      <SectionDivider />
      <Pricing />
      <SectionDivider />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </GridLayout>
  )
}
