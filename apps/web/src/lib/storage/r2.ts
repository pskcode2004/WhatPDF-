// ============================================
// Storage Client — Cloudflare R2 (S3-compatible)
// Used in API routes to upload/download files
// ============================================
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import fs from 'fs/promises'
import path from 'path'

const isLocalFallback = !process.env.STORAGE_ACCESS_KEY_ID
const LOCAL_STORAGE_DIR = path.join(process.cwd(), '..', '..', 'tmp_uploads')

const s3Client = isLocalFallback ? null : new S3Client({
  region: process.env.STORAGE_REGION ?? 'auto',
  endpoint: process.env.STORAGE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY!,
  },
})

const BUCKET = process.env.STORAGE_BUCKET ?? 'whatpdf-files'

/** Upload a file buffer to R2/S3 or local filesystem */
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

/** Generate a presigned download URL valid for 24 hours */
export async function getPresignedDownloadUrl(key: string, expiresInSeconds = 86400): Promise<string> {
  if (isLocalFallback) {
    return `/api/download-local?key=${encodeURIComponent(key)}`
  }

  return getSignedUrl(
    s3Client!,
    new GetObjectCommand({ Bucket: BUCKET, Key: key }),
    { expiresIn: expiresInSeconds },
  )
}

/** Delete a file from R2/S3 */
export async function deleteFile(key: string): Promise<void> {
  if (isLocalFallback) {
    try {
      await fs.unlink(path.join(LOCAL_STORAGE_DIR, key.replace(/\//g, '_')))
    } catch {} // Ignore
    return
  }
  await s3Client!.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
}

