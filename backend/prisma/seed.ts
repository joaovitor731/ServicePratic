import 'dotenv/config';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
});

if (!process.env.DATABASE_URL) {
  dotenv.config({
    path: path.resolve(process.cwd(), '.env.example'),
  });
}

async function main() {
  const { default: prisma } = await import('../src/infra/prisma/client.ts');
  const senha_hash = await bcrypt.hash('admin123', 10);

  await prisma.$executeRawUnsafe(
    `
    INSERT INTO usuario (nome, email, senha_hash, ativo)
    VALUES ('Administrador', 'admin@servicepratic.local', ?, true)
    ON DUPLICATE KEY UPDATE
      nome = VALUES(nome),
      senha_hash = VALUES(senha_hash),
      ativo = VALUES(ativo)
    `,
    senha_hash,
  );

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
