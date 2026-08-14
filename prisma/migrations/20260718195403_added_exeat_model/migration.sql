-- CreateEnum
CREATE TYPE "ExeatType" AS ENUM ('HEALTH', 'PERSONAL', 'TOWN_WING', 'VACATION');

-- CreateEnum
CREATE TYPE "ExeatStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'RETURNED', 'OVERDUE');

-- CreateTable
CREATE TABLE "exeats" (
    "id" TEXT NOT NULL,
    "exeatNumber" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "houseId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "type" "ExeatType" NOT NULL,
    "reason" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "guardianName" TEXT NOT NULL,
    "guardianContact" TEXT NOT NULL,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "expectedReturnDate" TIMESTAMP(3) NOT NULL,
    "actualReturnDate" TIMESTAMP(3),
    "status" "ExeatStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "approvedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exeats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "exeats_exeatNumber_key" ON "exeats"("exeatNumber");

-- CreateIndex
CREATE INDEX "exeats_studentId_idx" ON "exeats"("studentId");

-- CreateIndex
CREATE INDEX "exeats_approvedById_idx" ON "exeats"("approvedById");

-- CreateIndex
CREATE INDEX "exeats_status_idx" ON "exeats"("status");

-- CreateIndex
CREATE INDEX "exeats_exeatNumber_idx" ON "exeats"("exeatNumber");

-- AddForeignKey
ALTER TABLE "exeats" ADD CONSTRAINT "exeats_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exeats" ADD CONSTRAINT "exeats_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "houses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exeats" ADD CONSTRAINT "exeats_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exeats" ADD CONSTRAINT "exeats_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
