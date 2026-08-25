// ============================================
// Converter Router — picks the right engine
// based on the input/output format pair
// ============================================
import { downloadFile, uploadFile } from '../storage/r2'
import { generateFileKey, MIME_TYPES } from '@whatpdf/shared'
import type { FileFormat } from '@whatpdf/shared'
import { convertWithSharp } from './image.converter'
import { convertWithLibreOffice } from './libreoffice.converter'
import { convertPdfToImage } from './pdf.converter'

interface ConvertOptions {
  jobId: string
  inputFileKey: string
  inputFormat: string
  outputFormat: string
  onProgress: (pct: number) => Promise<void>
}

interface ConvertResult {
  outputFileKey: string
  outputSizeBytes: number
}

// Format groups
const IMAGE_FORMATS  = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'tiff', 'heic']
const OFFICE_FORMATS = ['docx', 'doc', 'pptx', 'ppt', 'xlsx', 'xls', 'csv', 'odt', 'ods']

export async function convertFile(opts: ConvertOptions): Promise<ConvertResult> {
  const { jobId, inputFileKey, inputFormat, outputFormat, onProgress } = opts
  const from = inputFormat as FileFormat
  const to   = outputFormat as FileFormat

  // Step 1: Download input file from R2
  await onProgress(20)
  const inputBuffer = await downloadFile(inputFileKey)

  // Step 2: Route to correct conversion engine
  await onProgress(35)
  let outputBuffer: Buffer

  if (IMAGE_FORMATS.includes(from) && IMAGE_FORMATS.includes(to)) {
    // Image → Image (JPG, PNG, WebP, etc.) — Sharp
    outputBuffer = await convertWithSharp(inputBuffer, to)

  } else if (from === 'pdf' && IMAGE_FORMATS.includes(to)) {
    // PDF → Image — pdf-lib + Sharp
    outputBuffer = await convertPdfToImage(inputBuffer, to)

  } else if (OFFICE_FORMATS.includes(from) || to === 'pdf') {
    // Office documents (Word/Excel/PPT) ↔ PDF — LibreOffice
    outputBuffer = await convertWithLibreOffice(inputBuffer, from, to)

  } else {
    throw new Error(`No conversion engine available for ${from} → ${to}`)
  }

  // Step 3: Upload output file to R2
  await onProgress(80)
  const outputKey = generateFileKey(jobId, 'output', to)
  const contentType = MIME_TYPES[to] ?? 'application/octet-stream'
  await uploadFile(outputKey, outputBuffer, contentType)

  await onProgress(100)
  return {
    outputFileKey:   outputKey,
    outputSizeBytes: outputBuffer.byteLength,
  }
}
