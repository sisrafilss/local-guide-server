/*
  Warnings:

  - You are about to drop the column `trnsactionId` on the `payments` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "payments_trnsactionId_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "trnsactionId";
