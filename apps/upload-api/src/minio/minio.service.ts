import * as Minio from 'minio'
import { ENV } from '../globals/env'
import { InsertFileType } from '../upload'

// Instantiate the MinIO client with the object store service
export const minioClient = new Minio.Client({
  accessKey: '1UxcxyANSL1EPQLySbRv',
  endPoint: 'localhost',
  port: 9000,
  secretKey: 'KAaYeGVEClPf3zThXdx6IBkFzZZqaJbtzC3A3cEY',
  useSSL: false,
})

export class MINIO {
  public static async insertFile({ id, name, file }: Pick<InsertFileType, 'id' | 'name' | 'file'>) {
    try {
      // Check if the bucket exists, if not, create it
      const exists = await minioClient.bucketExists(ENV.MINIO_BUCKET)
      if (!exists) {
        await minioClient.makeBucket(ENV.MINIO_BUCKET, ENV.MINIO_BUCKET_REGION)
      }

      const [start, base] = file.split(',') as [string, string]
      // Set the object metadata
      const metaData = {
        'Content-Type': start.split(':')[1]?.split(';')[0] ?? 'text/plain',
        example: 5678,
        'X-Amz-Meta-Testing': 1234,
      }

      // Convert the Base64 string to a Buffer
      const buffer = Buffer.from(base, 'base64')

      // Use putObject to upload the Buffer directly to Minio
      await minioClient.putObject(ENV.MINIO_BUCKET, `duck-upload-${id}-${name}`, buffer, buffer.length, metaData)

      // Generate a presigned URL for the uploaded file (valid for 1 hour)
      const fileUrl = await minioClient.presignedUrl(
        'GET',
        ENV.MINIO_BUCKET,
        `duck-upload-${id}-${name}`, // Use the same object key here
        60 * 60, // Expiry time in seconds (1 hour)
      )

      // Return the URL of the uploaded file
      return {
        fileUrl,
        message: 'File uploaded successfully',
      }
    } catch (_) {
      const error = {
        _,
        fileUrl: null,
        message: 'Error: failed to upload file to Minio',
      }
      console.log(error)
      return error
    }
  }
}
