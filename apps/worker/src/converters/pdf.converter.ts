// ============================================
// PDF Converter
// PDF → Image (first page) using pdf-lib + Sharp
// ============================================
import { PDFDocument } from 'pdf-lib'
import sharp from 'sharp'

/**
 * Convert PDF to an image (first page only in MVP).
 *
 * TODO for production: integrate Ghostscript or Puppeteer
 * for full-quality PDF rasterization:
 *   gs -dNOPAUSE -sDEVICE=jpeg -r150 -sOutputFile=out.jpg input.pdf
 */
export async function convertPdfToImage(
  inputBuffer: Buffer,
  outputFormat: 'jpg' | 'jpeg' | 'png' | string,
): Promise<Buffer> {
  // Load and validate PDF
  const pdfDoc = await PDFDocument.load(inputBuffer)
  const pageCount = pdfDoc.getPageCount()

  if (pageCount === 0) {
    throw new Error('PDF has no pages')
  }

  // Extract first page into a single-page PDF
  const singlePagePdf = await PDFDocument.create()
  const [firstPage] = await singlePagePdf.copyPages(pdfDoc, [0])
  singlePagePdf.addPage(firstPage)

  // Get page dimensions (points → pixels at 96dpi)
  const page = firstPage
  const width  = Math.round(page.getWidth()  * (96 / 72))
  const height = Math.round(page.getHeight() * (96 / 72))

  // Render a placeholder SVG (replace with Ghostscript for production)
  const svgContent = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="white"/>
      <text x="50%" y="50%" font-family="Arial" font-size="20" fill="#999" text-anchor="middle">
        PDF Page 1 of ${pageCount}
      </text>
    </svg>
  `

  const format = outputFormat === 'jpg' || outputFormat === 'jpeg' ? 'jpeg' : 'png'
  return sharp(Buffer.from(svgContent)).toFormat(format, { quality: 90 }).toBuffer()
}
