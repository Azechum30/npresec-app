/*
  Warnings:

  - A unique constraint covering the columns `[studentId,date,classId,semester,academicYear]` on the table `attendance` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "attendance_studentId_date_classId_key";

-- DropIndex
DROP INDEX "attendance_studentId_date_key";

-- CreateIndex
CREATE INDEX "attendance_studentId_idx" ON "attendance"("studentId");

-- CreateIndex
CREATE INDEX "attendance_classId_idx" ON "attendance"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_studentId_date_classId_semester_academicYear_key" ON "attendance"("studentId", "date", "classId", "semester", "academicYear");
