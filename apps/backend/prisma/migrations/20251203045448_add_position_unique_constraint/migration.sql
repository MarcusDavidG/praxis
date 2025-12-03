/*
  Warnings:

  - A unique constraint covering the columns `[userId,marketId,outcome]` on the table `positions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "positions_userId_marketId_outcome_key" ON "positions"("userId", "marketId", "outcome");
