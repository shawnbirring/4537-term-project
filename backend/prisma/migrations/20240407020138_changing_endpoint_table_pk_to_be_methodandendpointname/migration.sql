/*
  Warnings:

  - The primary key for the `EndpointUsage` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "EndpointUsage" DROP CONSTRAINT "EndpointUsage_pkey",
ADD CONSTRAINT "EndpointUsage_pkey" PRIMARY KEY ("method", "endpointName");
