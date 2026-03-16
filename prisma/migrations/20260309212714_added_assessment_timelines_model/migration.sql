-- CreateTable
CREATE TABLE "AssessmentTimeline" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "academicYear" INTEGER NOT NULL,
    "semester" TEXT NOT NULL,
    "assessmentType" "AssessmentType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssessmentTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentTimeline_courseId_academicYear_semester_assessmen_key" ON "AssessmentTimeline"("courseId", "academicYear", "semester", "assessmentType");

-- AddForeignKey
ALTER TABLE "AssessmentTimeline" ADD CONSTRAINT "AssessmentTimeline_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
