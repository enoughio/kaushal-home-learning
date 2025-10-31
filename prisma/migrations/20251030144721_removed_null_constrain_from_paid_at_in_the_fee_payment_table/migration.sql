-- AlterTable
ALTER TABLE "FeePayment" ALTER COLUMN "paidAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "temp_users" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '24 hours';
