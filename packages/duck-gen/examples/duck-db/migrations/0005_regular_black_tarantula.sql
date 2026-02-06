ALTER TABLE "file_links" ADD COLUMN "owner_user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "file_objects" ADD COLUMN "updated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "file_links" ADD CONSTRAINT "file_links_owner_user_id_users_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;