CREATE TYPE "public"."file_upload_kind" AS ENUM('post', 'multipart', 'put');--> statement-breakpoint
ALTER TABLE "file_objects" ADD COLUMN "upload_kind" "file_upload_kind" DEFAULT 'post' NOT NULL;--> statement-breakpoint
ALTER TABLE "file_objects" ADD COLUMN "multipart_upload_id" text;--> statement-breakpoint
ALTER TABLE "file_objects" ADD COLUMN "multipart_part_size" integer;--> statement-breakpoint
ALTER TABLE "file_objects" ADD COLUMN "multipart_part_count" integer;--> statement-breakpoint
ALTER TABLE "file_objects" ADD COLUMN "upload_expires_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "file_objects_upload_kind_idx" ON "file_objects" USING btree ("upload_kind");--> statement-breakpoint
CREATE INDEX "file_objects_multipart_upload_id_idx" ON "file_objects" USING btree ("multipart_upload_id");