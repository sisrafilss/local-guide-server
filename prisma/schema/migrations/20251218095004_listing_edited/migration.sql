-- DropForeignKey
ALTER TABLE "listings" DROP CONSTRAINT "listings_guideId_fkey";

-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "guides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
