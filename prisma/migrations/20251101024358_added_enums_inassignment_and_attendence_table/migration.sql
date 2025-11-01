/*
  Warnings:

  - The `status` column on the `assignments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `status` on the `attendance` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `marked_by` on table `attendance` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('ASSIGNED', 'SUBMITTED', 'GRADED');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'EXCUSED');

-- DropForeignKey
ALTER TABLE "public"."attendance" DROP CONSTRAINT "attendance_marked_by_fkey";

-- AlterTable
ALTER TABLE "assignments" DROP COLUMN "status",
ADD COLUMN     "status" "AssignmentStatus" NOT NULL DEFAULT 'ASSIGNED';

-- AlterTable
ALTER TABLE "attendance" DROP COLUMN "status",
ADD COLUMN     "status" "AttendanceStatus" NOT NULL,
ALTER COLUMN "marked_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "temp_users" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '24 hours';

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_marked_by_fkey" FOREIGN KEY ("marked_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
