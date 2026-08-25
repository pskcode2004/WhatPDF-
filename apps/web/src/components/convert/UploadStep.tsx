'use client'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useTranslations } from 'next-intl'
import { Upload, FileIcon } from 'lucide-react'
import type { FileFormat } from '@whatpdf/shared'
import { formatFileSize, MIME_TYPES } from '@whatpdf/shared'
import axios from 'axios'

interface UploadStepProps {
  from: FileFormat
  to: FileFormat
  onSuccess: (jobId: string) => void
  onError: (msg: string) => void
}

export function UploadStep({ from, to, onSuccess, onError }: UploadStepProps) {
  const t = useTranslations('common')
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) setSelectedFile(file)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [MIME_TYPES[from] ?? '*/*']: [`.${from}`] },
    maxFiles: 1,
    multiple: false,
  })

  async function handleConvert() {
    if (!selectedFile) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      const res = await axios.post<{ jobId: string }>(
        `/api/convert?from=${from}&to=${to}`,
        formData,
      )
      onSuccess(res.data.jobId)
    } catch {
      onError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {from.toUpperCase()} → {to.toUpperCase()}
        </h1>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-brand-500 bg-brand-50'
            : 'border-gray-300 hover:border-brand-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">{t('uploadPrompt')}</p>
        <p className="text-sm text-gray-400 mt-2">.{from.toUpperCase()} files</p>
      </div>

      {/* Selected file info */}
      {selectedFile && (
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border">
          <FileIcon className="w-5 h-5 text-gray-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</p>
            <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
          </div>
        </div>
      )}

      {/* Convert button */}
      <button
        onClick={handleConvert}
        disabled={!selectedFile || uploading}
        className="w-full py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {uploading ? t('converting') : t('convert')}
      </button>
    </div>
  )
}
