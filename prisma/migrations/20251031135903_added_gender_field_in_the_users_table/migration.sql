/*
  Warnings:

  - The `role` column on the `temp_users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `gender` column on the `temp_users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `gender` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'TEACHER', 'STUDENT');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "temp_users" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '24 hours',
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'OTHER';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'OTHER';

-- DropEnum
DROP TYPE "public"."GENDER";
