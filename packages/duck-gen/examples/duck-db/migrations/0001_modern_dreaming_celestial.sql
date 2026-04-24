CREATE TYPE "public"."file_purpose" AS ENUM('avatar', 'doc');--> statement-breakpoint
CREATE TYPE "public"."file_status" AS ENUM('pending', 'uploaded', 'committed', 'quarantined', 'deleted');--> statement-breakpoint
CREATE TABLE "file_objects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"owner_user_id" uuid NOT NULL,
	"bucket" text NOT NULL,
	"key" text NOT NULL,
	"status" "file_status" DEFAULT 'pending' NOT NULL,
	"purpose" "file_purpose" NOT NULL,
	"content_type" varchar(255) NOT NULL,
	"size" integer NOT NULL,
	"checksum_sha256" varchar(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"uploaded_at" timestamp with time zone,
	"committed_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "file_links" (
	"tenant_id" uuid NOT NULL,
	"file_id" uuid NOT NULL,
	"entity_type" varchar(64) NOT NULL,
	"entity_id" uuid NOT NULL,
	"field" varchar(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "file_links_tenant_id_entity_type_entity_id_field_pk" PRIMARY KEY("tenant_id","entity_type","entity_id","field")
);
--> statement-breakpoint
ALTER TABLE "file_objects" ADD CONSTRAINT "file_objects_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file_objects" ADD CONSTRAINT "file_objects_owner_user_id_users_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file_links" ADD CONSTRAINT "file_links_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file_links" ADD CONSTRAINT "file_links_file_id_file_objects_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."file_objects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "file_objects_bucket_key_unique_active" ON "file_objects" USING btree ("bucket","key") WHERE "file_objects"."deleted_at" is null;--> statement-breakpoint
CREATE INDEX "file_objects_tenant_id_idx" ON "file_objects" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "file_objects_owner_user_id_idx" ON "file_objects" USING btree ("owner_user_id");--> statement-breakpoint
CREATE INDEX "file_objects_status_created_at_idx" ON "file_objects" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "file_objects_purpose_idx" ON "file_objects" USING btree ("purpose");--> statement-breakpoint
CREATE INDEX "file_links_file_id_idx" ON "file_links" USING btree ("file_id");--> statement-breakpoint
CREATE INDEX "file_links_entity_idx" ON "file_links" USING btree ("tenant_id","entity_type","entity_id");