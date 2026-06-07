-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha_hash` VARCHAR(191) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cliente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `endereco` VARCHAR(191) NOT NULL,
    `observacao` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Equipamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cliente_id` INTEGER NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `marca` VARCHAR(191) NOT NULL,
    `modelo` VARCHAR(191) NOT NULL,
    `numero_serie` VARCHAR(191) NOT NULL,
    `defeito_relatado` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrdemServico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero` VARCHAR(191) NOT NULL,
    `cliente_id` INTEGER NOT NULL,
    `equipamento_id` INTEGER NOT NULL,
    `problema_relatado` VARCHAR(191) NOT NULL,
    `status` ENUM('ABERTA', 'EM_ANALISE', 'EM_EXECUCAO', 'FINALIZADA', 'CANCELADA') NOT NULL DEFAULT 'ABERTA',
    `data_abertura` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `data_fechamento` DATETIME(3) NULL,

    UNIQUE INDEX `OrdemServico_numero_key`(`numero`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HistoricoOrdemServico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ordem_servico_id` INTEGER NOT NULL,
    `usuario_id` INTEGER NOT NULL,
    `status_anterior` ENUM('ABERTA', 'EM_ANALISE', 'EM_EXECUCAO', 'FINALIZADA', 'CANCELADA') NOT NULL,
    `status_novo` ENUM('ABERTA', 'EM_ANALISE', 'EM_EXECUCAO', 'FINALIZADA', 'CANCELADA') NOT NULL,
    `observacao` VARCHAR(191) NOT NULL,
    `data_evento` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Equipamento` ADD CONSTRAINT `Equipamento_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `Cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrdemServico` ADD CONSTRAINT `OrdemServico_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `Cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrdemServico` ADD CONSTRAINT `OrdemServico_equipamento_id_fkey` FOREIGN KEY (`equipamento_id`) REFERENCES `Equipamento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HistoricoOrdemServico` ADD CONSTRAINT `HistoricoOrdemServico_ordem_servico_id_fkey` FOREIGN KEY (`ordem_servico_id`) REFERENCES `OrdemServico`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HistoricoOrdemServico` ADD CONSTRAINT `HistoricoOrdemServico_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
