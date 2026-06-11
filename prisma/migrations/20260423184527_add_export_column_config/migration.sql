-- CreateTable
CREATE TABLE "export_column_configs" (
    "id" TEXT NOT NULL,
    "exportKey" TEXT NOT NULL,
    "columns" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "export_column_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "export_column_configs_exportKey_key" ON "export_column_configs"("exportKey");
