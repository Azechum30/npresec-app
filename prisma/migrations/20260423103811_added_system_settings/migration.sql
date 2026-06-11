-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "enableEditing" BOOLEAN NOT NULL DEFAULT false,
    "enableDeleting" BOOLEAN NOT NULL DEFAULT false,
    "enableScoresEntry" BOOLEAN NOT NULL DEFAULT false,
    "enableDataExports" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);
