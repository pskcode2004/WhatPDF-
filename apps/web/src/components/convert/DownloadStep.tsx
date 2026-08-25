'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CheckCircle, Download, RotateCcw, Trash2 } from 'lucide-react'
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
  const [deleted, setDeleted] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this file immediately?')) return
    setDeleting(true)
    try {
      await axios.delete(`/api/jobs/${jobId}`)
      setDeleted(true)
    } catch {
      alert('Failed to delete file. It will be removed automatically after 24h.')
    } finally {
      setDeleting(false)
    }
  }

  if (deleted) {
    return (
      <div className="text-center space-y-6 py-8">
        <Trash2 className="w-16 h-16 text-gray-400 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">File Deleted</h2>
        <p className="text-sm text-gray-500">Your file has been permanently removed from our servers.</p>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 mt-4 px-6 py-2 bg-brand-500 text-white font-medium rounded-lg hover:bg-brand-600 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          {t('convertAnother')}
        </button>
      </div>
    )
  }

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

      {/* Convert another & Delete */}
      <div className="flex flex-col items-center gap-4 mt-6">
        <button
          onClick={onReset}
          className="flex items-center gap-2 mx-auto text-gray-500 hover:text-gray-700 text-sm transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          {t('convertAnother')}
        </button>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-2 mt-2 text-red-400 hover:text-red-600 text-xs transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-3 h-3" />
          {deleting ? 'Deleting...' : 'Delete file now (Save space)'}
        </button>
      </div>
    </div>
  )
}
