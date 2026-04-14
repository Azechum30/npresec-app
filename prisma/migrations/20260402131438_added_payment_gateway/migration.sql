/*
  Warnings:

  - A unique constraint covering the columns `[url,hash]` on the table `documents` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `admissionId` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RESIDENTIAL_STATUS" AS ENUM ('Day', 'Boarding');

-- CreateEnum
CREATE TYPE "ADMISSION_STATUS" AS ENUM ('PENDING', 'ADMITTED', 'REJECT', 'WAITLISTED');

-- CreateEnum
CREATE TYPE "PAYMENT_PROVIDER" AS ENUM ('Paystack', 'FlutterWave', 'Stripe');

-- CreateEnum
CREATE TYPE "PAYMENT_STATUS" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "CURRENCY" AS ENUM ('GHS', 'USD', 'NGN');

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "admissionId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "hash" TEXT;

-- CreateTable
CREATE TABLE "admissions" (
    "id" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "otherNames" TEXT NOT NULL,
    "birthDate" TEXT NOT NULL,
    "jhsIndexNumber" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "residentialStatus" "RESIDENTIAL_STATUS" NOT NULL DEFAULT 'Day',
    "jhsAttended" TEXT NOT NULL,
    "programme" TEXT NOT NULL,
    "guardianName" TEXT,
    "relation" TEXT,
    "guardianPhoneNumber" TEXT,
    "aggregateScore" INTEGER,
    "admissionStatus" "ADMISSION_STATUS" NOT NULL DEFAULT 'PENDING',
    "isAcceptancePaid" BOOLEAN NOT NULL DEFAULT false,
    "isFormSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "admissionId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" "CURRENCY" NOT NULL DEFAULT 'GHS',
    "provider" "PAYMENT_PROVIDER" NOT NULL DEFAULT 'Paystack',
    "reference" TEXT NOT NULL,
    "paymentStatus" "PAYMENT_STATUS" NOT NULL DEFAULT 'PENDING',
    "metadata" JSONB NOT NULL,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "admissions_jhsIndexNumber_idx" ON "admissions"("jhsIndexNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_reference_key" ON "Payment"("reference");

-- CreateIndex
CREATE INDEX "documents_url_idx" ON "documents"("url");

-- CreateIndex
CREATE UNIQUE INDEX "documents_url_hash_key" ON "documents"("url", "hash");

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_admissionId_fkey" FOREIGN KEY ("admissionId") REFERENCES "admissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_admissionId_fkey" FOREIGN KEY ("admissionId") REFERENCES "admissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
