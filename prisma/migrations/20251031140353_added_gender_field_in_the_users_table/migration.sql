/*
  Warnings:

  - The values [ADMIN,TEACHER,STUDENT] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('admin', 'teacher', 'student');
ALTER TABLE "public"."temp_users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "temp_users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "temp_users" ALTER COLUMN "role" SET DEFAULT 'student';
COMMIT;

-- AlterTable
ALTER TABLE "temp_users" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '24 hours',
ALTER COLUMN "role" SET DEFAULT 'student';
