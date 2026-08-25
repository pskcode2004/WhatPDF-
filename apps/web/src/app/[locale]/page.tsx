import { CONVERSION_ROUTES } from '@whatpdf/shared'
import { ToolGrid } from '@/components/home/ToolGrid'
import { Hero } from '@/components/home/Hero'
import { Navbar } from '@/components/layout/Navbar'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  await params // ensure locale is resolved

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Hero />
        <ToolGrid routes={CONVERSION_ROUTES} />
      </div>
    </main>
  )
}
