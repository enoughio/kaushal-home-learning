/*
  Warnings:

  - You are about to drop the column `rejection_reason` on the `teachers` table. All the data in the column will be lost.
  - You are about to drop the column `account_holder_name` on the `temp_teachers` table. All the data in the column will be lost.
  - You are about to drop the column `bank_account_number` on the `temp_teachers` table. All the data in the column will be lost.
  - You are about to drop the column `bank_ifsc_code` on the `temp_teachers` table. All the data in the column will be lost.
  - You are about to drop the column `bank_name` on the `temp_teachers` table. All the data in the column will be lost.
  - You are about to drop the column `hourly_rate` on the `temp_teachers` table. All the data in the column will be lost.
  - You are about to drop the column `max_students` on the `temp_teachers` table. All the data in the column will be lost.
  - You are about to drop the column `monthly_salary` on the `temp_teachers` table. All the data in the column will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `salary_payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `student_fees` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('SALARY', 'FEE');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'BANK_TRANSFER', 'ONLINE_PAYMENT');

-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "payments_processed_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "payments_student_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."salary_payments" DROP CONSTRAINT "salary_payments_processed_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."salary_payments" DROP CONSTRAINT "salary_payments_teacher_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."student_fees" DROP CONSTRAINT "student_fees_student_id_fkey";

-- AlterTable
ALTER TABLE "teachers" DROP COLUMN "rejection_reason";

-- AlterTable
ALTER TABLE "temp_teachers" DROP COLUMN "account_holder_name",
DROP COLUMN "bank_account_number",
DROP COLUMN "bank_ifsc_code",
DROP COLUMN "bank_name",
DROP COLUMN "hourly_rate",
DROP COLUMN "max_students",
DROP COLUMN "monthly_salary";

-- AlterTable
ALTER TABLE "temp_users" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '24 hours';

-- DropTable
DROP TABLE "public"."payments";

-- DropTable
DROP TABLE "public"."salary_payments";

-- DropTable
DROP TABLE "public"."student_fees";

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "payment_type" "PaymentType" NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "transactionId" TEXT NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT DEFAULT 'success',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedById" INTEGER,
    "salaryPaymentId" INTEGER,
    "feePaymentId" INTEGER,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalaryPayment" (
    "id" SERIAL NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "base_salary" DOUBLE PRECISION NOT NULL,
    "bonus" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "deductions" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unpaid',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "teacherId" INTEGER NOT NULL,

    CONSTRAINT "SalaryPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeePayment" (
    "id" SERIAL NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'due',
    "reminder_sent" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "FeePayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "Payment"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_salaryPaymentId_key" ON "Payment"("salaryPaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_feePaymentId_key" ON "Payment"("feePaymentId");

-- CreateIndex
CREATE INDEX "Payment_payment_type_payment_date_idx" ON "Payment"("payment_type", "payment_date");

-- CreateIndex
CREATE INDEX "Payment_processedById_idx" ON "Payment"("processedById");

-- CreateIndex
CREATE INDEX "SalaryPayment_month_year_idx" ON "SalaryPayment"("month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "SalaryPayment_teacherId_month_year_key" ON "SalaryPayment"("teacherId", "month", "year");

-- CreateIndex
CREATE INDEX "FeePayment_month_year_idx" ON "FeePayment"("month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "FeePayment_studentId_month_year_key" ON "FeePayment"("studentId", "month", "year");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_processedById_fkey" FOREIGN KEY ("processedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_salaryPaymentId_fkey" FOREIGN KEY ("salaryPaymentId") REFERENCES "SalaryPayment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_feePaymentId_fkey" FOREIGN KEY ("feePaymentId") REFERENCES "FeePayment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaryPayment" ADD CONSTRAINT "SalaryPayment_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeePayment" ADD CONSTRAINT "FeePayment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
