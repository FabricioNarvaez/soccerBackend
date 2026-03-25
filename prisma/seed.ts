import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const coach1 = await prisma.user.upsert({
    where: { email: 'coach1@soccer.com' },
    update: {},
    create: {
      email: 'coach1@soccer.com',
      password: 'password123',
      name: 'Carlo Ancelotti',
      role: 'COACH',
    },
  });

  const coach2 = await prisma.user.upsert({
    where: { email: 'coach2@soccer.com' },
    update: {},
    create: {
      email: 'coach2@soccer.com',
      password: 'password123',
      name: 'Xavi Hernandez',
      role: 'COACH',
    },
  });

  const teamHome = await prisma.team.upsert({
    where: { name: 'Real Madrid' },
    update: {},
    create: {
      name: 'Real Madrid',
      acronym: 'RMA',
      coachId: coach1.id,
      color: '#FFFFFF',
    },
  });

  const teamAway = await prisma.team.upsert({
    where: { name: 'FC Barcelona' },
    update: {},
    create: {
      name: 'FC Barcelona',
      acronym: 'FCB',
      coachId: coach2.id,
      color: '#004170',
    },
  });

  const match = await prisma.match.create({
    data: {
      date: new Date(),
      location: 'Santiago Bernabéu',
      homeTeamId: teamHome.id,
      awayTeamId: teamAway.id,
      homeGoals: 0,
      awayGoals: 0,
      isFinished: false,
    },
  });

  console.log('✅ Semilla ejecutada con éxito:');
  console.log({
    entrenadores: [coach1.name, coach2.name],
    equipos: [teamHome.name, teamAway.name],
    partidoId: match.id,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
