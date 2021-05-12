-- CreateEnum
CREATE TYPE "name_status" AS ENUM ('accepted', 'synonym', 'unknown');

-- CreateTable
CREATE TABLE "accessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "number" TEXT NOT NULL,
    "index" SERIAL NOT NULL,
    "year_index" INTEGER NOT NULL,
    "taxon_id" UUID NOT NULL,
    "accessioned_on" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "base_id" UUID NOT NULL,
    "data" JSONB NOT NULL DEFAULT E'{}',
    "created_at" TIMESTAMPTZ(6),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bases" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "namespace" VARCHAR(64),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "parent_id" UUID,
    "base_id" UUID NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations_tree" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "parent_id" UUID NOT NULL,
    "child_id" UUID NOT NULL,
    "depth" INTEGER NOT NULL,
    "base_id" UUID NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "names" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "scientific_name" TEXT NOT NULL,
    "name_according_to" TEXT,
    "name_published_in" TEXT,
    "name_published_in_year" INTEGER,
    "family" TEXT,
    "genus" TEXT,
    "subgenus" TEXT,
    "specific_epithet" TEXT,
    "infraspecific_epithet" TEXT,
    "name_authorship" TEXT,
    "taxon_remarks" TEXT,
    "taxon_rank" TEXT NOT NULL,
    "aggregate" TEXT,
    "microspecies" TEXT,
    "subspecies" TEXT,
    "variety" TEXT,
    "subvariety" TEXT,
    "form" TEXT,
    "subform" INTEGER,
    "group" TEXT,
    "cultivar" TEXT,
    "base_id" UUID NOT NULL,
    "wfo_name_reference" TEXT,
    "flora_name_id" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specimens" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "accession_id" UUID NOT NULL,
    "qualifier" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "location_id" UUID,
    "base_id" UUID NOT NULL,
    "data" JSONB NOT NULL DEFAULT E'{}',

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taxa" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "flora_taxon_id" UUID,
    "base_id" UUID NOT NULL,
    "data" JSONB NOT NULL DEFAULT E'{}',

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taxa_names" (
    "taxon_id" UUID NOT NULL,
    "name_id" UUID NOT NULL,
    "status" "name_status" NOT NULL,
    "base_id" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "taxon_determinations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "determined_by" TEXT,
    "determined_on" DATE NOT NULL,
    "taxon_id" UUID NOT NULL,
    "accession_id" UUID NOT NULL,
    "base_id" UUID NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "accessions_base_id_idx" ON "accessions"("base_id");

-- CreateIndex
CREATE INDEX "accessions_data_idx" ON "accessions"("data");

-- CreateIndex
CREATE INDEX "accessions_number_idx" ON "accessions"("number");

-- CreateIndex
CREATE INDEX "bases_namespace_idx" ON "bases"("namespace");

-- CreateIndex
CREATE INDEX "locations_base_id_idx" ON "locations"("base_id");

-- CreateIndex
CREATE INDEX "locations_parent_id_idx" ON "locations"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "locations_tree_parent_id_child_id_key" ON "locations_tree"("parent_id", "child_id");

-- CreateIndex
CREATE INDEX "locations_tree_base_id_idx" ON "locations_tree"("base_id");

-- CreateIndex
CREATE INDEX "locations_tree_child_id_idx" ON "locations_tree"("child_id");

-- CreateIndex
CREATE INDEX "locations_tree_depth_idx" ON "locations_tree"("depth");

-- CreateIndex
CREATE INDEX "locations_tree_parent_id_idx" ON "locations_tree"("parent_id");

-- CreateIndex
CREATE INDEX "names_base_id_idx" ON "names"("base_id");

-- CreateIndex
CREATE INDEX "names_family_idx" ON "names"("family");

-- CreateIndex
CREATE INDEX "names_genus_idx" ON "names"("genus");

-- CreateIndex
CREATE INDEX "names_scientific_name_idx" ON "names"("scientific_name");

-- CreateIndex
CREATE INDEX "names_flora_name_id_idx" ON "names"("flora_name_id");

-- CreateIndex
CREATE INDEX "specimens_accession_id_idx" ON "specimens"("accession_id");

-- CreateIndex
CREATE INDEX "specimens_base_id_idx" ON "specimens"("base_id");

-- CreateIndex
CREATE INDEX "specimens_data_idx" ON "specimens"("data");

-- CreateIndex
CREATE INDEX "specimens_location_id_idx" ON "specimens"("location_id");

-- CreateIndex
CREATE INDEX "taxa_base_id_idx" ON "taxa"("base_id");

-- CreateIndex
CREATE INDEX "taxa_data_idx" ON "taxa"("data");

-- CreateIndex
CREATE INDEX "taxa_flora_taxon_id_idx" ON "taxa"("flora_taxon_id");

-- CreateIndex
CREATE UNIQUE INDEX "taxa_names_key" ON "taxa_names"("taxon_id", "name_id");

-- CreateIndex
CREATE INDEX "taxa_names_base_id_idx" ON "taxa_names"("base_id");

-- CreateIndex
CREATE INDEX "taxa_names_status_idx" ON "taxa_names"("status");

-- CreateIndex
CREATE INDEX "taxon_determinations_accession_id_idx" ON "taxon_determinations"("accession_id");

-- CreateIndex
CREATE INDEX "taxon_determinations_base_id_idx" ON "taxon_determinations"("base_id");

-- CreateIndex
CREATE INDEX "taxon_determinations_taxon_id_idx" ON "taxon_determinations"("taxon_id");

-- AddForeignKey
ALTER TABLE "accessions" ADD FOREIGN KEY ("base_id") REFERENCES "bases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessions" ADD FOREIGN KEY ("taxon_id") REFERENCES "taxa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD FOREIGN KEY ("parent_id") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations_tree" ADD FOREIGN KEY ("child_id") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations_tree" ADD FOREIGN KEY ("parent_id") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "names" ADD FOREIGN KEY ("base_id") REFERENCES "bases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "specimens" ADD FOREIGN KEY ("accession_id") REFERENCES "accessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "specimens" ADD FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxa_names" ADD FOREIGN KEY ("name_id") REFERENCES "names"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxa_names" ADD FOREIGN KEY ("taxon_id") REFERENCES "taxa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
