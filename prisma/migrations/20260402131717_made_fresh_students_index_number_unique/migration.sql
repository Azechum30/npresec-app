/*
  Warnings:

  - A unique constraint covering the columns `[jhsIndexNumber]` on the table `admissions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "admissions_jhsIndexNumber_key" ON "admissions"("jhsIndexNumber");
