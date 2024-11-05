/*
  Warnings:

  - You are about to drop the column `automovel` on the `alocacao` table. All the data in the column will be lost.
  - You are about to drop the column `concecionaria` on the `alocacao` table. All the data in the column will be lost.
  - Added the required column `automovelId` to the `Alocacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `concessionariaId` to the `Alocacao` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `alocacao_automovel_key` ON `alocacao`;

-- AlterTable
ALTER TABLE `alocacao` DROP COLUMN `automovel`,
    DROP COLUMN `concecionaria`,
    ADD COLUMN `automovelId` INTEGER NOT NULL,
    ADD COLUMN `concessionariaId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Alocacao` ADD CONSTRAINT `Alocacao_automovelId_fkey` FOREIGN KEY (`automovelId`) REFERENCES `Automoveis`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Alocacao` ADD CONSTRAINT `Alocacao_concessionariaId_fkey` FOREIGN KEY (`concessionariaId`) REFERENCES `Concessionarias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
