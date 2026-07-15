-- CreateIndex
CREATE INDEX "classes_staffId_idx" ON "classes"("staffId");

-- CreateIndex
CREATE INDEX "classes_departmentId_idx" ON "classes"("departmentId");

-- CreateIndex
CREATE INDEX "documents_admissionId_idx" ON "documents"("admissionId");

-- CreateIndex
CREATE INDEX "documents_studentId_idx" ON "documents"("studentId");

-- CreateIndex
CREATE INDEX "payments_admissionId_idx" ON "payments"("admissionId");

-- CreateIndex
CREATE INDEX "payments_studentId_idx" ON "payments"("studentId");

-- CreateIndex
CREATE INDEX "payments_feeId_idx" ON "payments"("feeId");

-- CreateIndex
CREATE INDEX "rooms_houseId_idx" ON "rooms"("houseId");

-- CreateIndex
CREATE INDEX "staff_departmentId_idx" ON "staff"("departmentId");

-- CreateIndex
CREATE INDEX "students_classId_idx" ON "students"("classId");

-- CreateIndex
CREATE INDEX "students_roomId_idx" ON "students"("roomId");

-- CreateIndex
CREATE INDEX "students_houseId_idx" ON "students"("houseId");
