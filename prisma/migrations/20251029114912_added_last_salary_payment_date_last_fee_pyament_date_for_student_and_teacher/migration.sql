-- AlterTable
ALTER TABLE "students" ADD COLUMN     "last_fee_payment_date" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "last_salary_payment_date" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "temp_users" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '24 hours';
