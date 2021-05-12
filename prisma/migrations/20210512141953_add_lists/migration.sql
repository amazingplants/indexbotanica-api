/*
  Warnings:

  - Made the column `accession_number_format` on table `bases` required. This step will fail if there are existing NULL values in that column.
  - Made the column `specimen_number_format` on table `bases` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "list_type" AS ENUM ('accessions', 'taxa', 'specimens');

-- AlterTable
ALTER TABLE "bases" ALTER COLUMN "accession_number_format" SET NOT NULL,
ALTER COLUMN "specimen_number_format" SET NOT NULL;

-- CreateTable
CREATE TABLE "accessions_lists" (
    "accession_id" UUID NOT NULL,
    "list_id" UUID NOT NULL,
    "base_id" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "lists" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "base_id" UUID NOT NULL,
    "type" "list_type" NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specimens_lists" (
    "specimen_id" UUID NOT NULL,
    "list_id" UUID NOT NULL,
    "base_id" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "taxa_lists" (
    "taxon_id" UUID NOT NULL,
    "list_id" UUID NOT NULL,
    "base_id" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "accessions_lists_accession_id_list_id_idx" ON "accessions_lists"("accession_id", "list_id");

-- CreateIndex
CREATE INDEX "accessions_lists_base_id_idx" ON "accessions_lists"("base_id");

-- CreateIndex
CREATE INDEX "lists_base_id_idx" ON "lists"("base_id");

-- CreateIndex
CREATE UNIQUE INDEX "specimens_lists_specimen_id_list_id_idx" ON "specimens_lists"("specimen_id", "list_id");

-- CreateIndex
CREATE INDEX "specimens_lists_base_id_idx" ON "specimens_lists"("base_id");

-- CreateIndex
CREATE UNIQUE INDEX "taxa_lists_taxon_id_list_id_idx" ON "taxa_lists"("taxon_id", "list_id");

-- CreateIndex
CREATE INDEX "taxa_lists_base_id_idx" ON "taxa_lists"("base_id");

-- AddForeignKey
ALTER TABLE "accessions_lists" ADD FOREIGN KEY ("base_id") REFERENCES "bases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessions_lists" ADD FOREIGN KEY ("accession_id") REFERENCES "accessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessions_lists" ADD FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lists" ADD FOREIGN KEY ("base_id") REFERENCES "bases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "specimens_lists" ADD FOREIGN KEY ("base_id") REFERENCES "bases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "specimens_lists" ADD FOREIGN KEY ("specimen_id") REFERENCES "specimens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "specimens_lists" ADD FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxa_lists" ADD FOREIGN KEY ("base_id") REFERENCES "bases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxa_lists" ADD FOREIGN KEY ("taxon_id") REFERENCES "taxa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxa_lists" ADD FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD FOREIGN KEY ("base_id") REFERENCES "bases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations_tree" ADD FOREIGN KEY ("base_id") REFERENCES "bases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "specimens" ADD FOREIGN KEY ("base_id") REFERENCES "bases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxa" ADD FOREIGN KEY ("base_id") REFERENCES "bases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxa_names" ADD FOREIGN KEY ("base_id") REFERENCES "bases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxon_determinations" ADD FOREIGN KEY ("base_id") REFERENCES "bases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxon_determinations" ADD FOREIGN KEY ("taxon_id") REFERENCES "taxa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxon_determinations" ADD FOREIGN KEY ("accession_id") REFERENCES "accessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
