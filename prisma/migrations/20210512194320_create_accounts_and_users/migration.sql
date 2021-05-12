/*
  Warnings:

  - Added the required column `account_id` to the `bases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bases" ADD COLUMN     "account_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "hashed_password" TEXT NOT NULL,
    "account_id" UUID NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bases_account_id_idx" ON "bases"("account_id");

-- AddForeignKey
ALTER TABLE "users" ADD FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bases" ADD FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
