/*
  Warnings:

  - Added the required column `name` to the `lists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `lists` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "lists" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "lists_slug_idx" ON "lists"("slug");
