-- CreateTable
CREATE TABLE "house_allocations" (
    "id" TEXT NOT NULL,
    "houseId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" "RESIDENTIAL_STATUS" NOT NULL DEFAULT 'Day',

    CONSTRAINT "house_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "house_allocations_studentId_idx" ON "house_allocations"("studentId");

-- CreateIndex
CREATE INDEX "house_allocations_houseId_idx" ON "house_allocations"("houseId");

-- CreateIndex
CREATE UNIQUE INDEX "house_allocations_houseId_studentId_key" ON "house_allocations"("houseId", "studentId");

-- AddForeignKey
ALTER TABLE "house_allocations" ADD CONSTRAINT "house_allocations_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "houses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "house_allocations" ADD CONSTRAINT "house_allocations_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
