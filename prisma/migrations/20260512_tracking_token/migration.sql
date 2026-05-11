-- AlterTable
ALTER TABLE "Order" ADD COLUMN "trackingToken" TEXT;

-- Backfill existing orders with random tokens
UPDATE "Order" SET "trackingToken" = gen_random_uuid()::text WHERE "trackingToken" IS NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_trackingToken_key" ON "Order"("trackingToken");
