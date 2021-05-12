/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `created_at` on table `accessions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "accessions" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "accessions_lists" ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now();

-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now();

-- AlterTable
ALTER TABLE "bases" ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now();

-- AlterTable
ALTER TABLE "lists" ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now();

-- AlterTable
ALTER TABLE "locations" ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now();

-- AlterTable
ALTER TABLE "names" ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now();

-- AlterTable
ALTER TABLE "specimens" ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now();

-- AlterTable
ALTER TABLE "specimens_lists" ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now();

-- AlterTable
ALTER TABLE "taxa" ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now();

-- AlterTable
ALTER TABLE "taxa_lists" ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now();

-- AlterTable
ALTER TABLE "taxa_names" ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now();

-- AlterTable
ALTER TABLE "taxon_determinations" ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now();

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
ADD COLUMN     "deleted_at" TIMESTAMPTZ(6);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_idx" ON "users"("email");
