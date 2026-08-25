// ============================================
// LibreOffice Converter
// Handles: DOCX/PPTX/XLSX/CSV ↔ PDF
// Requires LibreOffice in Docker container
// ============================================
import { exec } from 'child_process'
import { promisify } from 'util'
import { writeFile, readFile, rm, mkdtemp } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'

const execAsync = promisify(exec)

/**
 * LibreOffice requires explicit filter names for many conversions.
 * Without the correct filter name, it cannot find the right exporter.
 * 
 * Format: --convert-to "format:FilterName"
 * Filters reference: https://wiki.documentfoundation.org/Documentation/DevGuide/Spreadsheet_Documents
 */
const FILTER_MAP: Record<string, string> = {
  // Office → PDF
  'pdf': 'writer_pdf_Export',

  // PDF / Office → Word
  'docx': 'MS Word 2007 XML',
  'doc':  'MS Word 97',

  // Office → PowerPoint
  'pptx': 'Impress MS PowerPoint 2007 XML',
  'ppt':  'MS PowerPoint 97',

  // Office → Excel / CSV
  'xlsx': 'Calc MS Excel 2007 XML',
  'xls':  'MS Excel 97',
  'csv':  'Text - txt - csv (StarCalc)',

  // Open Document
  'odt':  'writer8',
  'ods':  'calc8',
}

/**
 * Convert a document using LibreOffice headless mode.
 * Creates a temp directory, writes input, runs conversion, reads output.
 */
export async function convertWithLibreOffice(
  inputBuffer: Buffer,
  inputFormat: string,
  outputFormat: string,
): Promise<Buffer> {
  const tempDir    = await mkdtemp(join(tmpdir(), 'whatpdf-'))
  const inputPath  = join(tempDir, `input.${inputFormat}`)
  const outputPath = join(tempDir, `input.${outputFormat}`)

  try {
    await writeFile(inputPath, inputBuffer)

    // Build the --convert-to argument with explicit filter if available
    const filterName = FILTER_MAP[outputFormat]
    const convertTo  = filterName
      ? `"${outputFormat}:${filterName}"`
      : outputFormat

    // When importing a PDF, LibreOffice must open it in the correct application
    // to export it properly. Writer for Word, Impress for PPT, Calc for Excel.
    let infilter = ''
    if (inputFormat === 'pdf') {
      if (['docx', 'doc', 'rtf', 'odt'].includes(outputFormat)) {
        infilter = '--infilter="writer_pdf_import"'
      } else if (['pptx', 'ppt', 'odp'].includes(outputFormat)) {
        infilter = '--infilter="impress_pdf_import"'
      } else if (['xlsx', 'xls', 'csv', 'ods'].includes(outputFormat)) {
        infilter = '--infilter="calc_pdf_import"'
      } else {
        infilter = '--infilter="draw_pdf_import"'
      }
    }

    const cmd = [
      'libreoffice',
      '--headless',
      '--norestore',
      infilter,
      `--convert-to ${convertTo}`,
      `--outdir "${tempDir}"`,
      `"${inputPath}"`,
    ].filter(Boolean).join(' ')

    const { stderr } = await execAsync(cmd, { timeout: 120_000 }) // 2 min timeout

    // LibreOffice sometimes writes warnings to stderr — only throw on real errors
    if (stderr && stderr.toLowerCase().includes('error')) {
      throw new Error(`LibreOffice error: ${stderr}`)
    }

    const outputBuffer = await readFile(outputPath)
    return outputBuffer
  } finally {
    await rm(tempDir, { recursive: true, force: true })
  }
}
