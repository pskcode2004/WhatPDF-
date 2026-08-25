'use client'
import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/routing'
import { FileText, Image as ImageIcon, Sheet, FileSpreadsheet, Presentation, FileCode, File, ArrowRight } from 'lucide-react'
import type { ConversionRoute, ConversionCategory, FileFormat } from '@whatpdf/shared'

// Icon per category
const CATEGORY_ICONS: Record<ConversionCategory, React.ComponentType<{ className?: string }>> = {
  document:    FileText,
  image:       ImageIcon,
  spreadsheet: Sheet,
}

// Color scheme per category (made slightly more subtle to let icons pop)
const CATEGORY_COLORS: Record<ConversionCategory, string> = {
  document:    'bg-white hover:bg-blue-50 border-blue-100 text-gray-700 hover:border-blue-300 hover:shadow-sm',
  image:       'bg-white hover:bg-purple-50 border-purple-100 text-gray-700 hover:border-purple-300 hover:shadow-sm',
  spreadsheet: 'bg-white hover:bg-green-50 border-green-100 text-gray-700 hover:border-green-300 hover:shadow-sm',
}

function getFormatIcon(format: FileFormat) {
  const size = "w-7 h-7"
  switch (format) {
    case 'pdf': return <File className={`${size} text-red-500 fill-red-50`} />
    case 'docx': case 'doc': return <FileText className={`${size} text-blue-600 fill-blue-50`} />
    case 'xlsx': case 'xls': case 'csv': case 'ods': return <FileSpreadsheet className={`${size} text-green-600 fill-green-50`} />
    case 'pptx': case 'ppt': return <Presentation className={`${size} text-orange-500 fill-orange-50`} />
    case 'jpg': case 'jpeg': case 'png': case 'webp': case 'gif': case 'svg': case 'heic': case 'tiff': return <ImageIcon className={`${size} text-purple-500 fill-purple-50`} />
    case 'html': return <FileCode className={`${size} text-orange-600 fill-orange-50`} />
    case 'txt': return <FileText className={`${size} text-gray-500 fill-gray-50`} />
    default: return <File className={`${size} text-gray-400 fill-gray-50`} />
  }
}

interface ToolGridProps {
  routes: ConversionRoute[]
}

export function ToolGrid({ routes }: ToolGridProps) {
  const locale = useLocale() as 'th' | 'en'
  const t = useTranslations('categories')
  
  // State for the active filter tab
  const [activeTab, setActiveTab] = useState<'all' | ConversionCategory>('all')

  // Group routes by category
  const grouped = routes.reduce<Record<ConversionCategory, ConversionRoute[]>>(
    (acc, route) => {
      if (!acc[route.category]) acc[route.category] = []
      acc[route.category].push(route)
      return acc
    },
    {} as Record<ConversionCategory, ConversionRoute[]>,
  )
  
  const categories = Object.keys(grouped) as ConversionCategory[]

  return (
    <div className="space-y-8">
      {/* Pill Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
            activeTab === 'all' 
              ? 'bg-gray-800 text-white' 
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          {t('all')}
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeTab === cat 
                ? 'bg-gray-800 text-white' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {t(cat)}
          </button>
        ))}
      </div>

      <div className="space-y-12">
        {categories
          .filter(cat => activeTab === 'all' || activeTab === cat)
          .map((category) => {
          const Icon = CATEGORY_ICONS[category]
          return (
            <section key={category}>
              {activeTab === 'all' && (
                <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-6 px-1">
                  <Icon className="w-6 h-6 text-brand-600" />
                  {t(category)}
                </h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {grouped[category].map((route) => (
                  <Link
                    key={`${route.from}-${route.to}`}
                    href={`/convert/${route.from}/${route.to}`}
                    className={`flex flex-col p-5 rounded-2xl border transition-all duration-200 ${CATEGORY_COLORS[route.category]}`}
                  >
                    <div className="flex items-center justify-between mb-4 px-2">
                      {getFormatIcon(route.from)}
                      <ArrowRight className="w-5 h-5 text-gray-300" />
                      {getFormatIcon(route.to)}
                    </div>
                    <div className="text-center font-semibold text-[15px]">
                      {route.label[locale]}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
