import { eq } from 'drizzle-orm/expressions'
import { buckets, db, files, folders } from '../drizzle/index'
import {
  DeleteBucketType,
  DeleteFileType,
  DeleteFolderType,
  GetBucketsType,
  GetBucketType,
  GetFolderType,
  InsertBucketType,
  InsertFileType,
  InsertFolderType,
} from './upload.dto'
import { MINIO } from '../minio/minio.service'
import { BucketFilesType, BucketFoldersType, GetSchemaType, TRPC_RESPONSE } from '../globals'
import { nestObjectsByTreeLevelAndFolderId } from './upload.lib'
import { sql } from 'drizzle-orm'

export class UploadService {
  public static async getBuckets({ user_id }: GetBucketsType) {
    try {
      // Query for buckets
      const _buckets = await db.query.buckets.findMany({
        where(fields, operators) {
          return operators.eq(fields.user_id, user_id)
        },
      })
      if (!_buckets) return { message: 'No buckets found', data: null }

      return { data: _buckets, message: `Buckets found` }
    } catch (_) {
      const error = {
        data: null,
        message: `ERROR: failed to query this User .. with id ${user_id}`,
        _,
      }
      console.log(_)
      return error
    }
  }

  public static async getBucket({
    bucket_id,
  }: GetBucketType): Promise<TRPC_RESPONSE<(BucketFilesType | BucketFoldersType)[]>> {
    try {
      // Query for folders where bucket_id matches and folder_id is null
      const _folders = await db.query.folders.findMany({
        where(fields, operators) {
          return operators.and(
            operators.eq(fields.bucket_id, bucket_id), // bucket_id should match
            operators.isNull(fields.folder_id), // folder_id should be null
          )
        },
      })

      // Query for files where bucket_id matches
      const _files = await db.query.files.findMany({
        where(fields, operators) {
          return operators.and(
            operators.eq(fields.bucket_id, bucket_id), // bucket_id should match
            operators.isNull(fields.folder_id), // folder_id should be null
          )
        },
      })
      if (!_files && !_folders) return { message: 'No files or folders found', data: null, _: null }

      // Return combined result of folders and files
      return {
        data: [..._folders, ..._files] as (BucketFilesType | BucketFoldersType)[],
        message: `Bucket ${bucket_id} found`,
      }
    } catch (_) {
      const error = {
        data: null,
        message: `ERROR: failed to query this Bucket .. with id ${bucket_id}`,
        _,
      }
      console.log(error)
      return error
    }
  }

  public static async getFolder({
    folder_id,
  }: GetFolderType): Promise<TRPC_RESPONSE<(BucketFilesType | BucketFoldersType)[]>> {
    try {
      // Query for files where folder_id matches
      const _files = await db.query.files.findMany({
        where(fields, operators) {
          return operators.eq(fields.folder_id, folder_id)
        },
      })

      const _folders = await db.query.folders.findMany({
        where(fields, operators) {
          return operators.eq(fields.folder_id, folder_id)
        },
      })

      if (!_files && !_folders) {
        return { message: 'No files or folders found', data: null }
      }
      // Return combined result of folders and files
      return {
        data: [..._folders, ..._files] as (BucketFilesType | BucketFoldersType)[],
        message: `Folder ${folder_id} found`,
      }
    } catch (_) {
      const error = {
        data: null,
        message: `ERROR: failed to query this Folder .. with id ${folder_id}`,
        _,
      }
      console.log(error)
      return error
    }
  }

  // NOTE: INSERTERs
  public static async insertBucket({ user_id, name }: InsertBucketType) {
    try {
      const _buckets = await db
        .insert(buckets)
        .values({
          name,
          user_id,
        })
        .returning()
      if (!_buckets) {
        return { message: `No buckets uploaded with name ${name}`, data: null }
      }

      return { data: _buckets, message: `Bucket ${name} uploaded` }
    } catch (_) {
      const error = {
        data: null,
        message: `ERROR: failed to upload this Bucket .. with name ${name}`,
        _,
      }
      console.log(error)
      return error
    }
  }

  public static async insertFolder({ name, folder_id, bucket_id, tree_level }: InsertFolderType) {
    try {
      const _folders = await db
        .insert(folders)
        .values({
          name,
          tree_level,
          folder_id,
          bucket_id,
        })
        .returning()
      if (!_folders) {
        return { message: `No folders uploaded with name ${name}`, data: null }
      }
      console.log(_folders)

      return { data: _folders[0], message: `Folder ${name} uploaded` }
    } catch (_) {
      const error = {
        data: null,
        message: `ERROR: failed to upload this Folder .. with name ${name}`,
        _,
      }
      console.log(error)
      return error
    }
  }

  public static async insertFile({
    id,
    name,
    size,
    type,
    folder_id,
    bucket_id,
    tree_level,
    file,
  }: InsertFileType): Promise<TRPC_RESPONSE<GetSchemaType<typeof files>>> {
    try {
      const _file = await MINIO.insertFile({
        id,
        name,
        file,
      })
      if (!_file.fileUrl) {
        return { message: `No files uploaded with name ${name}`, data: null, _: null }
      }

      const _files = await db
        .insert(files)
        .values({
          name,
          url: _file.fileUrl,
          size,
          type,
          folder_id,
          bucket_id,
          tree_level,
        })
        .returning()
      if (!_files) {
        return { message: `No files uploaded with name ${name}`, data: null, _: null }
      }

      return {
        data: _files,
        message: `File ${name} uploaded`,
        _: null,
      }
    } catch (_) {
      const error = {
        data: null,
        message: `ERROR: failed to upload this File .. with name ${name}`,
      }
      console.log(error)
      return error
    }
  }
  // NOTE: DELETERs;
  public static async deleteBucket({ id }: DeleteBucketType) {
    try {
      const _bucket = await db.delete(buckets).where(eq(buckets.id, id))
      if (!_bucket) {
        return { message: `No bucket found with id ${id}`, data: null }
      }

      const _files = await db.delete(files).where(eq(files.bucket_id, id)).returning()
      const _folders = await db.delete(folders).where(eq(folders.bucket_id, id)).returning()
      return { data: _bucket, message: `Bucket ${id} deleted` }
    } catch (_) {
      const error = {
        data: null,

        message: `ERROR: failed to delete this Bucket .. with id ${id}`,
      }
      console.log(error)
      return error
    }
  }
  public static async deleteFile({ id }: DeleteFileType) {
    try {
      const _file = await db.delete(files).where(eq(files.id, id))
      if (!_file) return { message: 'No file found' }

      return { data: _file, message: `File ${id} deleted` }
    } catch (_) {
      const error = {
        data: null,
        message: `ERROR: failed to delete this File .. with id ${id}`,
        _,
      }
      console.log(error)
      return error
    }
  }
  public static async deleteFolder({ id }: DeleteFolderType) {
    try {
      const _folder = await db.delete(folders).where(eq(folders.id, id))
      if (!_folder) return { message: 'No folder found' }

      const _files = await db.delete(files).where(eq(files.folder_id, id)).returning()
      const _folders = await db.delete(folders).where(eq(folders.folder_id, id)).returning()
      return { data: _folder, message: `Folder ${id} dleted` }
    } catch (_) {
      const error = {
        data: null,

        message: `ERROR: failed to delete this Folder..with id ${id} `,
        _,
      }
      console.log(error)
      return error
    }
  }
  //  NOTE: UPDATERs;
  public static async updateBucket({ id, ...props }: InsertBucketType) {
    try {
      const _buckets = await db
        .update(buckets)
        .set({ id, ...props })
        .where(eq(buckets.id, id))
        .returning()

      return { data: _buckets, message: `Bucket ${id} updated` }
    } catch (_) {
      const error = {
        data: null,
        message: `ERROR: failed to update this Bucket..with id ${id} `,
        _,
      }
      console.log(error)
      return error
    }
  }
  public static async updateFolder({ id, ...props }: InsertFolderType) {
    try {
      const _folders = await db
        .update(folders)
        .set({ id, ...props })
        .where(eq(folders.id, id))
        .returning()

      return { data: _folders, message: `Folder ${id} updated` }
    } catch (_) {
      const error = {
        data: null,
        message: `ERROR: failed to update this Folder..with id ${id} `,
        _,
      }
      console.log(error)
      return error
    }
  }
  public static async updateFile({ id, ...props }: InsertFileType) {
    try {
      const _files = await db
        .update(files)
        .set({ id, ...props })
        .where(eq(files.id, id))
        .returning()

      return { data: _files, message: `File ${id} updated` }
    } catch (_) {
      const error = {
        data: null,
        message: `ERROR: failed to update this File..with id ${id} `,
        _,
      }
      console.log(error)
      return error
    }
  }
}
