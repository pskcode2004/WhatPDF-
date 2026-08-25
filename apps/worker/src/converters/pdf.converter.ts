// ============================================
// PDF Converter
// PDF → Image (first page) using poppler-utils
// ============================================
import { exec } from 'child_process'
import { promisify } from 'util'
import { writeFile, readFile, rm, mkdtemp } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'

const execAsync = promisify(exec)

/**
 * Convert PDF to an image (first page) using pdftocairo (from poppler-utils).
 */
export async function convertPdfToImage(
  inputBuffer: Buffer,
  outputFormat: 'jpg' | 'jpeg' | 'png' | 'webp' | string,
): Promise<Buffer> {
  const tempDir = await mkdtemp(join(tmpdir(), 'whatpdf-pdf-'))
  const inputPath = join(tempDir, 'input.pdf')
  
  try {
    await writeFile(inputPath, inputBuffer)
    
    // Use pdftocairo to extract the first page
    // -f 1 -l 1 : first and last page (page 1)
    // -jpeg or -png : format
    // -r 150 : resolution 150 dpi
    // -singlefile : do not append page numbers
    
    const isPng = outputFormat === 'png' || outputFormat === 'webp'
    const formatFlag = isPng ? '-png' : '-jpeg'
    const outputPathPrefix = join(tempDir, 'out')
    
    const cmd = `pdftocairo ${formatFlag} -r 150 -f 1 -l 1 -singlefile "${inputPath}" "${outputPathPrefix}"`
    await execAsync(cmd, { timeout: 60_000 })
    
    // pdftocairo -singlefile outputs exactly 'out.jpg' or 'out.png'
    const actualOutputPath = `${outputPathPrefix}.${isPng ? 'png' : 'jpg'}`
    let outputBuffer = await readFile(actualOutputPath)

    // If target was webp, we need to pass it through sharp
    if (outputFormat === 'webp') {
      const sharp = (await import('sharp')).default
      outputBuffer = await sharp(outputBuffer).webp({ quality: 80 }).toBuffer()
    }
    
    return outputBuffer
  } finally {
    await rm(tempDir, { recursive: true, force: true })
  }
}

/**
 * Convert PDF to Text using pdftotext (from poppler-utils).
 */
export async function convertPdfToText(inputBuffer: Buffer): Promise<Buffer> {
  const tempDir = await mkdtemp(join(tmpdir(), 'whatpdf-txt-'))
  const inputPath = join(tempDir, 'input.pdf')
  const outputPath = join(tempDir, 'out.txt')
  
  try {
    await writeFile(inputPath, inputBuffer)
    
    // Use pdftotext to extract text
    // -enc UTF-8 : output UTF-8 text
    const cmd = `pdftotext -enc UTF-8 "${inputPath}" "${outputPath}"`
    await execAsync(cmd, { timeout: 60_000 })
    
    const outputBuffer = await readFile(outputPath)
    return outputBuffer
  } finally {
    await rm(tempDir, { recursive: true, force: true })
  }
}

/**
 * Convert PDF to DOCX using Python's pdf2docx library.
 * This provides significantly better layout retention than LibreOffice Draw.
 */
export async function convertPdfToDocx(inputBuffer: Buffer): Promise<Buffer> {
  const tempDir = await mkdtemp(join(tmpdir(), 'whatpdf-docx-'))
  const inputPath = join(tempDir, 'input.pdf')
  const outputPath = join(tempDir, 'out.docx')
  
  try {
    await writeFile(inputPath, inputBuffer)
    
    // pdf2docx CLI: pdf2docx convert <input> <output>
    const cmd = `pdf2docx convert "${inputPath}" "${outputPath}"`
    await execAsync(cmd, { timeout: 120_000 }) // 2 min timeout
    
    const outputBuffer = await readFile(outputPath)
    return outputBuffer
  } finally {
    await rm(tempDir, { recursive: true, force: true })
  }
}
