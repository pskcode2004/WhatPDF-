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
  // --------------------------------------------
  // Document Conversions
  // --------------------------------------------
  { from: 'docx', to: 'pdf', category: 'document', engine: 'libreoffice', label: { en: 'Word to PDF',        th: 'Word เป็น PDF' } },
  { from: 'doc',  to: 'pdf', category: 'document', engine: 'libreoffice', label: { en: 'Word to PDF',        th: 'Word เป็น PDF' } },
  { from: 'pptx', to: 'pdf', category: 'document', engine: 'libreoffice', label: { en: 'PowerPoint to PDF',  th: 'PowerPoint เป็น PDF' } },
  { from: 'ppt',  to: 'pdf', category: 'document', engine: 'libreoffice', label: { en: 'PowerPoint to PDF',  th: 'PowerPoint เป็น PDF' } },
  { from: 'pdf',  to: 'txt', category: 'document', engine: 'poppler',     label: { en: 'PDF to Text',        th: 'PDF เป็น ข้อความ (TXT)' } },

  // --------------------------------------------
  // Image Conversions
  // --------------------------------------------
  { from: 'pdf',  to: 'jpg',  category: 'image', engine: 'poppler', label: { en: 'PDF to JPG', th: 'PDF เป็น JPG' } },
  { from: 'pdf',  to: 'png',  category: 'image', engine: 'poppler', label: { en: 'PDF to PNG', th: 'PDF เป็น PNG' } },
  { from: 'jpg',  to: 'pdf',  category: 'image', engine: 'sharp',   label: { en: 'JPG to PDF', th: 'JPG เป็น PDF' } },
  { from: 'png',  to: 'pdf',  category: 'image', engine: 'sharp',   label: { en: 'PNG to PDF', th: 'PNG เป็น PDF' } },
  { from: 'jpg',  to: 'png',  category: 'image', engine: 'sharp',   label: { en: 'JPG to PNG', th: 'JPG เป็น PNG' } },
  { from: 'png',  to: 'jpg',  category: 'image', engine: 'sharp',   label: { en: 'PNG to JPG', th: 'PNG เป็น JPG' } },
  { from: 'webp', to: 'jpg',  category: 'image', engine: 'sharp',   label: { en: 'WEBP to JPG',th: 'WEBP เป็น JPG' } },
  { from: 'jpg',  to: 'webp', category: 'image', engine: 'sharp',   label: { en: 'JPG to WEBP',th: 'JPG เป็น WEBP' } },
  { from: 'png',  to: 'webp', category: 'image', engine: 'sharp',   label: { en: 'PNG to WEBP',th: 'PNG เป็น WEBP' } },

  // --------------------------------------------
  // Spreadsheet Conversions
  // --------------------------------------------
  { from: 'xlsx', to: 'pdf',  category: 'spreadsheet',  engine: 'libreoffice', label: { en: 'Excel to PDF',       th: 'Excel เป็น PDF' } },
  { from: 'xls',  to: 'pdf',  category: 'spreadsheet',  engine: 'libreoffice', label: { en: 'Excel to PDF',       th: 'Excel เป็น PDF' } },
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
