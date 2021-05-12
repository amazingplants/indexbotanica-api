/*
  Warnings:

  - Added the required column `namespace` to the `accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `bases` table without a default value. This is not possible if the table is not empty.
  - Made the column `namespace` on table `bases` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "namespace" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "bases" ADD COLUMN     "slug" VARCHAR(64) NOT NULL,
ALTER COLUMN "namespace" SET NOT NULL,
ALTER COLUMN "namespace" SET DATA TYPE VARCHAR(255);
