/*
  Warnings:

  - You are about to drop the `ApiUsage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ApiUsage";

-- CreateTable
CREATE TABLE "EndpointUsage" (
    "id" SERIAL NOT NULL,
    "method" TEXT NOT NULL,
    "endpointName" TEXT NOT NULL,
    "numberofRequests" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EndpointUsage_pkey" PRIMARY KEY ("id")
);
