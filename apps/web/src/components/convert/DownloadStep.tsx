'use client'
import { useTranslations } from 'next-intl'
import { CheckCircle, Download, RotateCcw } from 'lucide-react'
import type { FileFormat } from '@whatpdf/shared'

interface DownloadStepProps {
  downloadUrl: string
  to: FileFormat
  onReset: () => void
}

export function DownloadStep({ downloadUrl, to, onReset }: DownloadStepProps) {
  const t = useTranslations('common')

  return (
    <div className="text-center space-y-6 py-8">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
      <h2 className="text-2xl font-bold text-gray-900">{t('done')}</h2>
      <p className="text-sm text-gray-400">{t('fileExpiry')}</p>

      {/* Download button */}
      <a
        href={downloadUrl}
        download={`converted.${to}`}
        className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
      >
        <Download className="w-5 h-5" />
        {t('download')}
      </a>

      {/* Convert another */}
      <button
        onClick={onReset}
        className="flex items-center gap-2 mx-auto text-gray-500 hover:text-gray-700 text-sm transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        {t('convertAnother')}
      </button>
    </div>
  )
}
