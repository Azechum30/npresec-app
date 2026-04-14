/*
  Warnings:

  - The values [REJECT] on the enum `ADMISSION_STATUS` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ADMISSION_STATUS_new" AS ENUM ('PENDING', 'ADMITTED', 'REJECTED', 'WAITLISTED');
ALTER TABLE "public"."admissions" ALTER COLUMN "admissionStatus" DROP DEFAULT;
ALTER TABLE "admissions" ALTER COLUMN "admissionStatus" TYPE "ADMISSION_STATUS_new" USING ("admissionStatus"::text::"ADMISSION_STATUS_new");
ALTER TYPE "ADMISSION_STATUS" RENAME TO "ADMISSION_STATUS_old";
ALTER TYPE "ADMISSION_STATUS_new" RENAME TO "ADMISSION_STATUS";
DROP TYPE "public"."ADMISSION_STATUS_old";
ALTER TABLE "admissions" ALTER COLUMN "admissionStatus" SET DEFAULT 'PENDING';
COMMIT;
