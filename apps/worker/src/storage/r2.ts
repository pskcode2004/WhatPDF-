// ============================================
// Storage Client — R2/S3 for Worker
// Download input files, upload output files
// ============================================
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import fs from 'fs/promises'
import path from 'path'

const isLocalFallback = !process.env.STORAGE_ACCESS_KEY_ID
const LOCAL_STORAGE_DIR = path.join(process.cwd(), '..', '..', 'tmp_uploads')

const s3Client = isLocalFallback ? null : new S3Client({
  region:   process.env.STORAGE_REGION ?? 'auto',
  endpoint: process.env.STORAGE_ENDPOINT,
  credentials: {
    accessKeyId:     process.env.STORAGE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY!,
  },
})

const BUCKET = process.env.STORAGE_BUCKET ?? 'whatpdf-files'

/** Download a file from R2/S3 as a Buffer */
export async function downloadFile(key: string): Promise<Buffer> {
  if (isLocalFallback) {
    return await fs.readFile(path.join(LOCAL_STORAGE_DIR, key.replace(/\//g, '_')))
  }

  const response = await s3Client!.send(
    new GetObjectCommand({ Bucket: BUCKET, Key: key }),
  )

  const bytes = await response.Body?.transformToByteArray()
  if (!bytes) throw new Error('Empty body')
  return Buffer.from(bytes)
}

/** Upload a converted file to R2/S3 */
export async function uploadFile(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string,
): Promise<void> {
  if (isLocalFallback) {
    await fs.mkdir(LOCAL_STORAGE_DIR, { recursive: true })
    await fs.writeFile(path.join(LOCAL_STORAGE_DIR, key.replace(/\//g, '_')), body)
    return
  }

  await s3Client!.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  )
}

/** Delete a file from R2/S3 (used by cleanup cron) */
export async function deleteFile(key: string): Promise<void> {
  if (isLocalFallback) {
    try {
      await fs.unlink(path.join(LOCAL_STORAGE_DIR, key.replace(/\//g, '_')))
    } catch {} // Ignore error if file doesn't exist
    return
  }
  await s3Client!.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
}
