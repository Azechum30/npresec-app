/*
  Warnings:

  - A unique constraint covering the columns `[classTeacherId]` on the table `classes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "classes" ADD COLUMN     "classTeacherId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "classes_classTeacherId_key" ON "classes"("classTeacherId");

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_classTeacherId_fkey" FOREIGN KEY ("classTeacherId") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
