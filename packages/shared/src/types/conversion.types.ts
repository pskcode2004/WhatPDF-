// ============================================
// Conversion Types — file format registry
// All supported formats and routes live here
// ============================================

export type FileFormat =
  // Documents
  | 'pdf' | 'docx' | 'doc' | 'pptx' | 'ppt' | 'txt' | 'html' | 'odt'
  // Spreadsheets
  | 'xlsx' | 'xls' | 'csv' | 'ods'
  // Images
  | 'jpg' | 'jpeg' | 'png' | 'webp' | 'gif' | 'svg' | 'heic' | 'tiff'
  // Archives
  | 'zip'

export type ConversionCategory = 'document' | 'image' | 'spreadsheet'

export interface ConversionRoute {
  from: FileFormat
  to: FileFormat
  category: ConversionCategory
  engine: 'libreoffice' | 'sharp' | 'pdf-lib' | 'pandoc'
  label: {
    en: string
    th: string
  }
}

// ============================================
// All supported conversion routes
// ============================================
export const CONVERSION_ROUTES: ConversionRoute[] = [
  // --- PDF <-> Documents ---
  { from: 'pdf',  to: 'docx', category: 'document',     engine: 'libreoffice', label: { en: 'PDF to Word',        th: 'PDF เป็น Word' } },
  { from: 'pdf',  to: 'pptx', category: 'document',     engine: 'libreoffice', label: { en: 'PDF to PowerPoint',  th: 'PDF เป็น PowerPoint' } },
  { from: 'pdf',  to: 'xlsx', category: 'document',     engine: 'libreoffice', label: { en: 'PDF to Excel',       th: 'PDF เป็น Excel' } },
  { from: 'pdf',  to: 'txt',  category: 'document',     engine: 'pdf-lib',     label: { en: 'PDF to Text',        th: 'PDF เป็น Text' } },
  { from: 'pdf',  to: 'jpg',  category: 'image',        engine: 'pdf-lib',     label: { en: 'PDF to Image',       th: 'PDF เป็น รูปภาพ' } },
  { from: 'docx', to: 'pdf',  category: 'document',     engine: 'libreoffice', label: { en: 'Word to PDF',        th: 'Word เป็น PDF' } },
  { from: 'pptx', to: 'pdf',  category: 'document',     engine: 'libreoffice', label: { en: 'PowerPoint to PDF',  th: 'PowerPoint เป็น PDF' } },
  { from: 'xlsx', to: 'pdf',  category: 'document',     engine: 'libreoffice', label: { en: 'Excel to PDF',       th: 'Excel เป็น PDF' } },
  // --- Images ---
  { from: 'jpg',  to: 'png',  category: 'image',        engine: 'sharp',       label: { en: 'JPG to PNG',         th: 'JPG เป็น PNG' } },
  { from: 'png',  to: 'jpg',  category: 'image',        engine: 'sharp',       label: { en: 'PNG to JPG',         th: 'PNG เป็น JPG' } },
  { from: 'jpg',  to: 'webp', category: 'image',        engine: 'sharp',       label: { en: 'JPG to WebP',        th: 'JPG เป็น WebP' } },
  { from: 'png',  to: 'webp', category: 'image',        engine: 'sharp',       label: { en: 'PNG to WebP',        th: 'PNG เป็น WebP' } },
  { from: 'webp', to: 'jpg',  category: 'image',        engine: 'sharp',       label: { en: 'WebP to JPG',        th: 'WebP เป็น JPG' } },
  { from: 'heic', to: 'jpg',  category: 'image',        engine: 'sharp',       label: { en: 'HEIC to JPG',        th: 'HEIC เป็น JPG' } },
  // --- Spreadsheets ---
  { from: 'csv',  to: 'xlsx', category: 'spreadsheet',  engine: 'libreoffice', label: { en: 'CSV to Excel',       th: 'CSV เป็น Excel' } },
  { from: 'xlsx', to: 'csv',  category: 'spreadsheet',  engine: 'libreoffice', label: { en: 'Excel to CSV',       th: 'Excel เป็น CSV' } },
]

/** Get all output formats available for a given input format */
export function getOutputFormats(inputFormat: FileFormat): ConversionRoute[] {
  return CONVERSION_ROUTES.filter(r => r.from === inputFormat)
}

/** Check if a conversion route exists */
export function isRouteSupported(from: string, to: string): boolean {
  return CONVERSION_ROUTES.some(r => r.from === from && r.to === to)
}
