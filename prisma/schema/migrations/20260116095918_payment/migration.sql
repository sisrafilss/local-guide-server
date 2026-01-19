-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "paymentId" TEXT;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "invoiceUrl" TEXT;
