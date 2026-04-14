/*
  Warnings:

  - You are about to drop the column `region` on the `admissions` table. All the data in the column will be lost.
  - You are about to drop the column `relation` on the `admissions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "admissions" DROP COLUMN "region",
DROP COLUMN "relation",
ADD COLUMN     "guardianRelation" TEXT,
ADD COLUMN     "schoolRregion" TEXT;
