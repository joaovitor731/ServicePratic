-- CreateTable
CREATE TABLE `Servico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `valor_padrao` DECIMAL(10, 2) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Servico_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable
ALTER TABLE `OrdemServico`
    ADD COLUMN `valor_total` DECIMAL(10, 2) NOT NULL DEFAULT 0.00;

-- AddForeignKey
ALTER TABLE `HistoricoOrdemServico` DROP FOREIGN KEY `HistoricoOrdemServico_ordem_servico_id_fkey`;

-- AddForeignKey
ALTER TABLE `HistoricoOrdemServico` ADD CONSTRAINT `HistoricoOrdemServico_ordem_servico_id_fkey` FOREIGN KEY (`ordem_servico_id`) REFERENCES `OrdemServico`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE `OrdemServicoItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ordem_servico_id` INTEGER NOT NULL,
    `servico_id` INTEGER NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `valor_unitario` DECIMAL(10, 2) NOT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,

    INDEX `OrdemServicoItem_ordem_servico_id_idx`(`ordem_servico_id`),
    INDEX `OrdemServicoItem_servico_id_idx`(`servico_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OrdemServicoItem` ADD CONSTRAINT `OrdemServicoItem_ordem_servico_id_fkey` FOREIGN KEY (`ordem_servico_id`) REFERENCES `OrdemServico`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrdemServicoItem` ADD CONSTRAINT `OrdemServicoItem_servico_id_fkey` FOREIGN KEY (`servico_id`) REFERENCES `Servico`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
