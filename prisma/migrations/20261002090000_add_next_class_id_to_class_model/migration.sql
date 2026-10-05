/*
  Warnings:

  - You are about to drop the column `criteria` on the `student_promotions` table. All the data in the column will be lost.
  - You are about to drop the column `forcePromoted` on the `student_promotions` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `student_promotions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nextClassId]` on the table `classes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "classes" ADD COLUMN     "nextClassId" TEXT;

-- AlterTable
ALTER TABLE "student_promotions" DROP COLUMN "criteria",
DROP COLUMN "forcePromoted",
DROP COLUMN "notes",
ADD COLUMN     "fromClassId" TEXT,
ADD COLUMN     "toClassId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "classes_nextClassId_key" ON "classes"("nextClassId");

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_nextClassId_fkey" FOREIGN KEY ("nextClassId") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
