import { Test, TestingModule } from '@nestjs/testing';
import { MatchesService } from './matches.service';
import { PrismaService } from '../prisma/prisma.service';
import { cleanDatabase } from '../../test/test-utils';

describe('MatchesService', () => {
  let service: MatchesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchesService, PrismaService],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
    prisma = module.get<PrismaService>(PrismaService);

    await cleanDatabase(prisma);
  });

  it('Should add 3 points to local team and 1 goal to player after match finishes 1-0', async () => {
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

    const homeTeam = await prisma.team.create({
      data: {
        name: 'Equipo Local',
        acronym: 'LOC',
        coachId: coach1.id,
      },
    });

    const awayTeam = await prisma.team.create({
      data: {
        name: 'Equipo Visitante',
        acronym: 'VIS',
        coachId: coach2.id,
      },
    });

    const player = await prisma.player.create({
      data: {
        name: 'Jugador 1 Local',
        number: 9,
        age: 25,
        teamId: homeTeam.id,
      },
    });

    const match = await prisma.match.create({
      data: {
        date: new Date(),
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
      },
    });

    await service.update(match.id, {
      isFinished: true,
      homeGoals: 1,
      awayGoals: 0,
      homeScorers: [player.id],
    });

    const teamAfter = await prisma.team.findUnique({ where: { id: homeTeam.id } });
    const playerAfter = await prisma.player.findUnique({ where: { id: player.id } });
    const matchAfter = await prisma.match.findUnique({ where: { id: match.id } });

    expect(matchAfter.isFinished).toBe(true);
    expect(teamAfter.points).toBe(3);
    expect(playerAfter.goals).toBe(1);
  });
});
