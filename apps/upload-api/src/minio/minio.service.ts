import { ENV } from '../globals/env'
import { InsertFileType } from '../upload'

import * as Minio from 'minio'

export class MINIO {
  public static async insertFile({ name, file }: Partial<InsertFileType>) {
    try {
      // Instantiate the MinIO client with the object store service
      const minioClient = new Minio.Client({
        endPoint: 'localhost',
        port: 9000,
        useSSL: false,
        accessKey: '1UxcxyANSL1EPQLySbRv',
        secretKey: 'KAaYeGVEClPf3zThXdx6IBkFzZZqaJbtzC3A3cEY',
      })

      // Check if the bucket exists, if not, create it
      const exists = await minioClient.bucketExists(ENV.MINIO_BUCKET)
      if (!exists) {
        await minioClient.makeBucket(ENV.MINIO_BUCKET, ENV.MINIO_BUCKET_REGION)
      }

      // Set the object metadata
      const metaData = {
        'Content-Type': 'text/plain',
        'X-Amz-Meta-Testing': 1234,
        example: 5678,
      }

      // Upload the file
      await minioClient.fPutObject(ENV.MINIO_BUCKET, name, file, metaData)

      // Generate a presigned URL for the uploaded file (valid for 1 hour)
      const fileUrl = await minioClient.presignedUrl('GET', ENV.MINIO_BUCKET, name, 60 * 60) // 1 hour

      // Return the URL of the uploaded file
      return {
        message: 'File uploaded successfully',
        fileUrl,
      }
    } catch (_) {
      const error = {
        message: 'Error: failed to upload file to Minio',
        fileUrl: null,
        _,
      }
      console.log(error)
      return error
    }
  }
}
