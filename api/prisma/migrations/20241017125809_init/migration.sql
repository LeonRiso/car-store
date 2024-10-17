/*
  Warnings:

  - You are about to alter the column `preco` on the `automoveis` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Double`.

*/
-- AlterTable
ALTER TABLE `automoveis` MODIFY `preco` DOUBLE NOT NULL;
