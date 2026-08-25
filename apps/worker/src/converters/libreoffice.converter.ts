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
 * Convert a document using LibreOffice headless mode.
 * Creates a temp directory, writes input, runs conversion, reads output.
 */
export async function convertWithLibreOffice(
  inputBuffer: Buffer,
  inputFormat: string,
  outputFormat: string,
): Promise<Buffer> {
  // Create isolated temp directory for this conversion
  const tempDir = await mkdtemp(join(tmpdir(), 'whatpdf-'))
  const inputPath  = join(tempDir, `input.${inputFormat}`)
  const outputPath = join(tempDir, `input.${outputFormat}`)

  try {
    // Write input file to disk
    await writeFile(inputPath, inputBuffer)

    // Run LibreOffice conversion
    // --headless:    no GUI
    // --norestore:   don't restore previous session
    // --convert-to:  target format
    // --outdir:      output directory
    const cmd = [
      'libreoffice',
      '--headless',
      '--norestore',
      `--convert-to ${outputFormat}`,
      `--outdir "${tempDir}"`,
      `"${inputPath}"`,
    ].join(' ')

    const { stderr } = await execAsync(cmd, { timeout: 120_000 }) // 2 min timeout

    if (stderr && stderr.toLowerCase().includes('error')) {
      throw new Error(`LibreOffice error: ${stderr}`)
    }

    // Read and return the converted file
    const outputBuffer = await readFile(outputPath)
    return outputBuffer
  } finally {
    // Always clean up temp files, even on error
    await rm(tempDir, { recursive: true, force: true })
  }
}
