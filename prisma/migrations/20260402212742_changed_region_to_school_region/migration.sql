/*
  Warnings:

  - You are about to drop the column `schoolRregion` on the `admissions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "admissions" DROP COLUMN "schoolRregion",
ADD COLUMN     "schoolRegion" TEXT;
