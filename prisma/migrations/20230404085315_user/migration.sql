-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_economy" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "crystals" INTEGER NOT NULL DEFAULT 0,
    "fates" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_economy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_progression" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "exp" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_progression_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_discordId_key" ON "users"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "user_economy_userId_key" ON "user_economy"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_progression_userId_key" ON "user_progression"("userId");

-- AddForeignKey
ALTER TABLE "user_economy" ADD CONSTRAINT "user_economy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_progression" ADD CONSTRAINT "user_progression_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
