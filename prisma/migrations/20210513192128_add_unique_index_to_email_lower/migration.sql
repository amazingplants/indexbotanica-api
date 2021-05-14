/*
  Warnings:

  - A unique constraint covering the columns `[email_lower]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_email_idx";

-- CreateIndex
CREATE UNIQUE INDEX "users_email_lower_idx" ON "users"("email_lower");
