-- AlterTable
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'paymentId') THEN
        ALTER TABLE "bookings" ADD COLUMN "paymentId" TEXT;
    END IF;
END $$;

-- AlterTable
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'invoiceUrl') THEN
        ALTER TABLE "payments" ADD COLUMN "invoiceUrl" TEXT;
    END IF;
END $$;
