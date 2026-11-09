/*
  Warnings:

  - You are about to drop the column `content` on the `Template` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Template` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[type]` on the table `Template` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `documentHeading` to the `Template` table without a default value. This is not possible if the table is not empty.
  - Added the required column `intro` to the `Template` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Template` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Template_name_key";

-- AlterTable
ALTER TABLE "Template" DROP COLUMN "content",
DROP COLUMN "name",
ADD COLUMN     "documentHeading" TEXT NOT NULL,
ADD COLUMN     "instructions" TEXT,
ADD COLUMN     "intro" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Template_type_key" ON "Template"("type");
