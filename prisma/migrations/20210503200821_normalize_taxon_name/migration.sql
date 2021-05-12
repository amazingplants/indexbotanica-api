/*
  Warnings:

  - A unique constraint covering the columns `[name_id]` on the table `taxa` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name_id` to the `taxa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "taxa" ADD COLUMN     "name_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "taxa_name_id_unique" ON "taxa"("name_id");

-- AddForeignKey
ALTER TABLE "taxa" ADD FOREIGN KEY ("name_id") REFERENCES "names"("id") ON DELETE CASCADE ON UPDATE CASCADE;
