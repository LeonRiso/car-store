-- CreateTable
CREATE TABLE `alocacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `area` VARCHAR(255) NOT NULL,
    `automovel` VARCHAR(255) NOT NULL,
    `concecionaria` VARCHAR(255) NOT NULL,
    `quantidade` INTEGER NOT NULL,

    UNIQUE INDEX `alocacao_automovel_key`(`automovel`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `automoveis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `modelo` VARCHAR(255) NOT NULL,
    `preco` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clientes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `concessionarias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `concessionaria` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
