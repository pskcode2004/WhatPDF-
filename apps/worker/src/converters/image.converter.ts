// ============================================
// Image Converter — powered by Sharp
// Supports: JPG, PNG, WebP, GIF, TIFF, HEIC
// ============================================
import sharp from 'sharp'
import type { FileFormat } from '@whatpdf/shared'

// Map our format names to Sharp format identifiers
const SHARP_FORMAT_MAP: Record<string, keyof sharp.FormatEnum> = {
  jpg:  'jpeg',
  jpeg: 'jpeg',
  png:  'png',
  webp: 'webp',
  gif:  'gif',
  tiff: 'tiff',
  avif: 'avif',
}

/**
 * Convert an image buffer from one format to another using Sharp
 * e.g. JPG → PNG, PNG → WebP, HEIC → JPG
 */
export async function convertWithSharp(
  inputBuffer: Buffer,
  outputFormat: FileFormat,
): Promise<Buffer> {
  const targetFormat = SHARP_FORMAT_MAP[outputFormat]
  if (!targetFormat) {
    throw new Error(`Sharp does not support output format: ${outputFormat}`)
  }

  return sharp(inputBuffer)
    .toFormat(targetFormat, {
      quality: 90,  // For JPEG/WebP
      effort: 6,    // For WebP/AVIF encoding effort (0=fast, 6=slow/smaller)
    })
    .toBuffer()
}
