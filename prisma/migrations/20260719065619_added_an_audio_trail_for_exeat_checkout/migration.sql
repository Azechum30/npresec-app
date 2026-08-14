-- DropForeignKey
ALTER TABLE "exeats" DROP CONSTRAINT "exeats_approvedById_fkey";

-- DropIndex
DROP INDEX "exeats_approvedById_idx";

-- AlterTable
ALTER TABLE "exeats" ADD COLUMN     "checkInById" TEXT,
ADD COLUMN     "checkOutById" TEXT,
ALTER COLUMN "approvedById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "exeats" ADD CONSTRAINT "exeats_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exeats" ADD CONSTRAINT "exeats_checkOutById_fkey" FOREIGN KEY ("checkOutById") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exeats" ADD CONSTRAINT "exeats_checkInById_fkey" FOREIGN KEY ("checkInById") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
