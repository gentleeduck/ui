ALTER TABLE "file_objects" ALTER COLUMN "tenant_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "file_links" ALTER COLUMN "tenant_id" DROP NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "file_links_unique_tenant_scoped" ON "file_links" USING btree ("tenant_id","entity_type","entity_id","field") WHERE "file_links"."tenant_id" is not null;--> statement-breakpoint
CREATE UNIQUE INDEX "file_links_unique_global_scoped" ON "file_links" USING btree ("entity_type","entity_id","field") WHERE "file_links"."tenant_id" is null;