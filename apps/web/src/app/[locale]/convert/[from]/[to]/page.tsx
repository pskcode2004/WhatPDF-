// ============================================
// Converter Page — e.g. /th/convert/pdf/docx
// ============================================
import { notFound } from 'next/navigation'
import { isRouteSupported } from '@whatpdf/shared'
import type { FileFormat } from '@whatpdf/shared'
import { ConverterFlow } from '@/components/convert/ConverterFlow'
import { Navbar } from '@/components/layout/Navbar'

interface PageProps {
  params: Promise<{ locale: string; from: string; to: string }>
}

export default async function ConvertPage({ params }: PageProps) {
  const { from, to } = await params

  // Validate that this conversion route exists
  if (!isRouteSupported(from, to)) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <ConverterFlow from={from as FileFormat} to={to as FileFormat} />
      </div>
    </main>
  )
}
