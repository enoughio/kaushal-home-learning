/*
  Warnings:

  - You are about to drop the column `verified` on the `temp_users` table. All the data in the column will be lost.
  - The `gender` column on the `temp_users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `first_name` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `last_name` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "GENDER" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "temp_users" DROP COLUMN "verified",
ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "gender",
ADD COLUMN     "gender" "GENDER" NOT NULL DEFAULT 'OTHER',
ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '24 hours';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "gender" "GENDER" NOT NULL DEFAULT 'OTHER',
ALTER COLUMN "first_name" SET NOT NULL,
ALTER COLUMN "last_name" SET NOT NULL;
