'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'
import type { JobStatusResponse } from '@whatpdf/shared'

interface ProgressStepProps {
  jobId: string
  onSuccess: (downloadUrl: string) => void
  onError: (msg: string) => void
}

// ============================================
// ProgressStep — polls /api/jobs/:jobId every 2s
// Shows animated progress bar until done/failed
// ============================================
export function ProgressStep({ jobId, onSuccess, onError }: ProgressStepProps) {
  const t = useTranslations('common')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/jobs/${jobId}`)
        if (!res.ok) return
        const data: JobStatusResponse = await res.json()

        if (data.progress !== undefined) setProgress(data.progress)

        if (data.status === 'done' && data.downloadUrl) {
          clearInterval(interval)
          onSuccess(data.downloadUrl)
        } else if (data.status === 'failed') {
          clearInterval(interval)
          onError(data.errorMessage ?? 'Conversion failed')
        }
      } catch {
        // Network error — keep polling
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [jobId, onSuccess, onError])

  return (
    <div className="text-center space-y-6 py-8">
      <Loader2 className="w-12 h-12 text-brand-600 animate-spin mx-auto" />
      <p className="text-lg font-medium text-gray-700">{t('converting')}</p>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 bg-brand-500 rounded-full transition-all duration-500"
          style={{ width: `${progress || 10}%` }}
        />
      </div>
      <p className="text-sm text-gray-500">{progress}%</p>
    </div>
  )
}
