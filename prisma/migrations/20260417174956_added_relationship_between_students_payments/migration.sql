-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "studentId" TEXT;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "isPaymentAccepted" BOOLEAN DEFAULT false;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
