import { sql } from 'drizzle-orm'
import { index, integer, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'
import { filePurpose, fileStatus, fileUploadKind } from '../enums'
import { tenants } from '../tanants'
import { users } from '../user'

export const fileObjects = pgTable(
  'file_objects',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
    ownerUserId: uuid('owner_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    bucket: text('bucket').notNull(),
    key: text('key').notNull(),

    status: fileStatus('status').notNull().default('pending'),
    purpose: filePurpose('purpose').notNull(),

    contentType: varchar('content_type', { length: 255 }).notNull(),
    size: integer('size').notNull(),
    checksumSha256: varchar('checksum_sha256', { length: 64 }),

    // upload kind (single POST policy vs multipart)
    uploadKind: fileUploadKind('upload_kind').notNull().default('post'),

    // multipart session fields (nullable unless uploadKind='multipart')
    multipartUploadId: text('multipart_upload_id'),
    multipartPartSize: integer('multipart_part_size'),
    multipartPartCount: integer('multipart_part_count'),

    // when the current upload credentials/session expire (post policy or multipart part signing)
    uploadExpiresAt: timestamp('upload_expires_at', { withTimezone: true, mode: 'date' }),

    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    uploadedAt: timestamp('uploaded_at', { withTimezone: true, mode: 'date' }),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }),
    committedAt: timestamp('committed_at', { withTimezone: true, mode: 'date' }),
    deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'date' }),
  },
  (t) => [
    uniqueIndex('file_objects_bucket_key_unique_active').on(t.bucket, t.key).where(sql`${t.deletedAt} is null`),

    index('file_objects_tenant_id_idx').on(t.tenantId),
    index('file_objects_owner_user_id_idx').on(t.ownerUserId),

    index('file_objects_status_created_at_idx').on(t.status, t.createdAt),
    index('file_objects_purpose_idx').on(t.purpose),

    index('file_objects_upload_kind_idx').on(t.uploadKind),
    index('file_objects_multipart_upload_id_idx').on(t.multipartUploadId),
  ],
)
