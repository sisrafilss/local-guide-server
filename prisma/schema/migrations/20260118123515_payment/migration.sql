-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_enum
        WHERE enumlabel = 'CALCELLED'
    ) THEN
        ALTER TYPE "PaymentStatus" ADD VALUE 'CALCELLED';
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_enum
        WHERE enumlabel = 'FAILED'
    ) THEN
        ALTER TYPE "PaymentStatus" ADD VALUE 'FAILED';
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_enum
        WHERE enumlabel = 'REFUNDED'
    ) THEN
        ALTER TYPE "PaymentStatus" ADD VALUE 'REFUNDED';
    END IF;
END
$$;
