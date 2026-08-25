import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key')
  
  if (!key) {
    return NextResponse.json({ error: 'Missing key' }, { status: 400 })
  }

  const LOCAL_STORAGE_DIR = path.join(process.cwd(), '..', '..', 'tmp_uploads')
  const filePath = path.join(LOCAL_STORAGE_DIR, key.replace(/\//g, '_'))

  try {
    const file = await fs.readFile(filePath)
    
    // Guess content type based on extension
    const ext = path.extname(key).toLowerCase()
    let contentType = 'application/octet-stream'
    if (ext === '.pdf') contentType = 'application/pdf'
    if (ext === '.docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg'
    if (ext === '.png') contentType = 'image/png'

    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${path.basename(key)}"`,
      },
    })
  } catch (err) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}
