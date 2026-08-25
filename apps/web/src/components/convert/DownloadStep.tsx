'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CheckCircle, Download, RotateCcw } from 'lucide-react'
import type { FileFormat } from '@whatpdf/shared'
import axios from 'axios'

interface DownloadStepProps {
  jobId: string
  downloadUrl: string
  to: FileFormat
  onReset: () => void
}

export function DownloadStep({ jobId, downloadUrl, to, onReset }: DownloadStepProps) {
  const t = useTranslations('common')
  const [downloadStarted, setDownloadStarted] = useState(false)

  const handleDownload = () => {
    setDownloadStarted(true)
    // Automatically delete the file from the server after 30 seconds
    // to give the browser enough time to finish the download stream from R2.
    setTimeout(() => {
      axios.delete(`/api/jobs/${jobId}`).catch(console.error)
    }, 30000)
  }

  return (
    <div className="text-center space-y-6 py-8">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
      <h2 className="text-2xl font-bold text-gray-900">{t('done')}</h2>
      
      {downloadStarted ? (
        <p className="text-sm text-brand-600 font-medium">
          {t('autoDeleting') || 'Downloading... The file will be automatically deleted from our servers.'}
        </p>
      ) : (
        <p className="text-sm text-gray-400">
          {t('fileExpiry') || 'Ready to download'}
        </p>
      )}

      {/* Download button */}
      <a
        href={downloadUrl}
        onClick={handleDownload}
        download={`converted.${to}`}
        className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
      >
        <Download className="w-5 h-5" />
        {t('download')}
      </a>

      {/* Convert another */}
      <div className="flex flex-col items-center gap-4 mt-6">
        <button
          onClick={onReset}
          className="flex items-center gap-2 mx-auto text-gray-500 hover:text-gray-700 text-sm transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          {t('convertAnother')}
        </button>
      </div>
    </div>
  )
}
