/*
  Warnings:

  - A unique constraint covering the columns `[trnsactionId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `trnsactionId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "trnsactionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "payments_trnsactionId_key" ON "payments"("trnsactionId");
