import { PrismaService } from '../src/prisma/prisma.service';

export async function cleanDatabase(prisma: PrismaService) {
  const tables = ['match', 'player', 'team', 'user'];

  for (const table of tables) {
    await (prisma[table] as any).deleteMany();
  }
}
