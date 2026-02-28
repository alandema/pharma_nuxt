-- CreateTable
CREATE TABLE "logs" (
    "id" TEXT NOT NULL,
    "event_time" TIMESTAMP(3) NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);
