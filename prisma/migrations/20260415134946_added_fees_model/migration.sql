/*
  Warnings:

  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('OPENED', 'CLOSED', 'LATE_PAYMENT');

-- AlterEnum
ALTER TYPE "PAYMENT_PROVIDER" ADD VALUE 'Cash';

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_admissionId_fkey";

-- DropTable
DROP TABLE "Payment";

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "admissionId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "channel" TEXT,
    "ipAddress" TEXT,
    "transactionFee" DECIMAL(10,2) NOT NULL,
    "cardType" TEXT,
    "bank" TEXT,
    "brand" TEXT,
    "countryCode" TEXT,
    "accountName" TEXT,
    "ReceiverAccountNumber" TEXT,
    "ReceiverBank" TEXT,
    "customerName" TEXT,
    "customerPhoneNumber" TEXT,
    "customerCode" TEXT,
    "customerEmail" TEXT,
    "orderId" TEXT,
    "RequestedAmount" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "customerInternationalPhoneFormat" TEXT,
    "currency" "CURRENCY" NOT NULL DEFAULT 'GHS',
    "transactionId" BIGINT,
    "provider" "PAYMENT_PROVIDER" NOT NULL DEFAULT 'Paystack',
    "reference" TEXT,
    "paymentStatus" "PAYMENT_STATUS" NOT NULL DEFAULT 'PENDING',
    "feeId" TEXT,
    "metadata" JSONB,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fees" (
    "id" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" "CURRENCY" NOT NULL DEFAULT 'GHS',
    "count" INTEGER NOT NULL DEFAULT 0,
    "capacity" INTEGER,
    "status" "STATUS" NOT NULL DEFAULT 'CLOSED',
    "deadline" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_orderId_key" ON "payments"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transactionId_key" ON "payments"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_reference_key" ON "payments"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "payments_feeId_key" ON "payments"("feeId");

-- CreateIndex
CREATE INDEX "payments_orderId_reference_transactionId_idx" ON "payments"("orderId", "reference", "transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "fees_name_key" ON "fees"("name");

-- CreateIndex
CREATE INDEX "fees_academicYear_name_idx" ON "fees"("academicYear", "name");

-- CreateIndex
CREATE UNIQUE INDEX "fees_academicYear_name_key" ON "fees"("academicYear", "name");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_feeId_fkey" FOREIGN KEY ("feeId") REFERENCES "fees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_admissionId_fkey" FOREIGN KEY ("admissionId") REFERENCES "admissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
