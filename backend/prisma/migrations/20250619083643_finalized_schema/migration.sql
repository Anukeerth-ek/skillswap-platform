/*
  Warnings:

  - You are about to drop the column `skill` on the `Session` table. All the data in the column will be lost.
  - Added the required column `skillId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MENTOR', 'LEARNER', 'BOTH');

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "skill",
ADD COLUMN     "skillId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'LEARNER';

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
