-- AlterTable
ALTER TABLE "public"."properties" ALTER COLUMN "images" SET NOT NULL,
ALTER COLUMN "images" SET DEFAULT '',
ALTER COLUMN "images" SET DATA TYPE TEXT;
