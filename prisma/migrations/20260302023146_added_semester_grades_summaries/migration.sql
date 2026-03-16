-- CreateTable
CREATE TABLE "semester_summaries" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "semester" TEXT NOT NULL,
    "academicYear" INTEGER NOT NULL,
    "tgp" DOUBLE PRECISION NOT NULL,
    "tcr" INTEGER NOT NULL,
    "gpa" DOUBLE PRECISION NOT NULL,
    "ccr" INTEGER NOT NULL,
    "cgv" DOUBLE PRECISION NOT NULL,
    "cgpa" DOUBLE PRECISION NOT NULL,
    "classRank" INTEGER,
    "totalStudents" INTEGER,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "semester_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "semester_summaries_studentId_academicYear_idx" ON "semester_summaries"("studentId", "academicYear");

-- CreateIndex
CREATE UNIQUE INDEX "semester_summaries_studentId_academicYear_semester_key" ON "semester_summaries"("studentId", "academicYear", "semester");

-- AddForeignKey
ALTER TABLE "semester_summaries" ADD CONSTRAINT "semester_summaries_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
