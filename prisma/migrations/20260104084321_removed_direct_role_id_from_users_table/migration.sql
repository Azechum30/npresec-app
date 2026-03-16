/*
  Warnings:

  - You are about to drop the column `roleId` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_roleId_email_username_idx";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "roleId";

-- CreateIndex
CREATE INDEX "users_email_username_idx" ON "users"("email", "username");
