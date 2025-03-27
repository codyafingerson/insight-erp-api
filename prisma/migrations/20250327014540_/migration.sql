-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELED');

-- CreateTable
CREATE TABLE "OrderItem"
(
    "id"        TEXT             NOT NULL,
    "orderId"   TEXT             NOT NULL,
    "productId" TEXT             NOT NULL,
    "quantity"  INTEGER          NOT NULL,
    "price"     DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order"
(
    "id"          TEXT             NOT NULL,
    "name"        TEXT             NOT NULL,
    "description" TEXT,
    "orderDate"   TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status"      "OrderStatus"    NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
