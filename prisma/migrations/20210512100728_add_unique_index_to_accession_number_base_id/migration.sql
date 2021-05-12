/*
  Warnings:

  - A unique constraint covering the columns `[base_id,number]` on the table `accessions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "accessions_number_idx";

-- CreateIndex
CREATE UNIQUE INDEX "accessions_number_base_id_idx" ON "accessions"("base_id", "number");
