-- CreateTable
CREATE TABLE "ApiUsage" (
    "id" SERIAL NOT NULL,
    "getTotal" INTEGER NOT NULL DEFAULT 0,
    "postTotal" INTEGER NOT NULL DEFAULT 0,
    "deleteTotal" INTEGER NOT NULL DEFAULT 0,
    "patchTotal" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiUsage_pkey" PRIMARY KEY ("id")
);
