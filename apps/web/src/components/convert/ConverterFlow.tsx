'use client'
import { useState } from 'react'
import type { FileFormat } from '@whatpdf/shared'
import { UploadStep } from './UploadStep'
import { ProgressStep } from './ProgressStep'
import { DownloadStep } from './DownloadStep'
import { useTranslations } from 'next-intl'

export type ConvertStep = 'upload' | 'converting' | 'done' | 'error'

interface ConverterFlowProps {
  from: FileFormat
  to: FileFormat
}

// ============================================
// ConverterFlow — orchestrates the 3-step flow:
// [Upload] -> [Converting] -> [Download]
// ============================================
export function ConverterFlow({ from, to }: ConverterFlowProps) {
  const t = useTranslations('common')
  const [step, setStep] = useState<ConvertStep>('upload')
  const [jobId, setJobId] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  function handleUploadDone(id: string) {
    setJobId(id)
    setStep('converting')
  }

  function handleConvertDone(url: string) {
    setDownloadUrl(url)
    setStep('done')
  }

  function handleError(msg: string) {
    setErrorMsg(msg)
    setStep('error')
  }

  function handleReset() {
    setStep('upload')
    setJobId(null)
    setDownloadUrl(null)
    setErrorMsg(null)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      {step === 'upload' && (
        <UploadStep from={from} to={to} onSuccess={handleUploadDone} onError={handleError} />
      )}
      {step === 'converting' && jobId && (
        <ProgressStep jobId={jobId} onSuccess={handleConvertDone} onError={handleError} />
      )}
      {step === 'done' && downloadUrl && jobId && (
        <DownloadStep downloadUrl={downloadUrl} to={to} jobId={jobId} onReset={handleReset} />
      )}
      {step === 'error' && (
        <div className="text-center py-8">
          <p className="text-red-600 mb-6">{errorMsg ?? t('error')}</p>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
          >
            {t('convertAnother')}
          </button>
        </div>
      )}
    </div>
  )
}
