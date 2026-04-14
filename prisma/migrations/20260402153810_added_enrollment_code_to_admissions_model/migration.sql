/*
  Warnings:

  - A unique constraint covering the columns `[enrollmentCode]` on the table `admissions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "admissions" ADD COLUMN     "district" TEXT,
ADD COLUMN     "enrollmentCode" TEXT,
ADD COLUMN     "hometown" TEXT,
ADD COLUMN     "primaryAddress" TEXT,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "schoolLocation" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "admissions_enrollmentCode_key" ON "admissions"("enrollmentCode");
