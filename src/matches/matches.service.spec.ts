import { Test, TestingModule } from '@nestjs/testing';
import { MatchesService } from './matches.service';
import { PrismaService } from '../prisma/prisma.service';
import { cleanDatabase } from '../../test/test-utils';
import { TeamFactory } from '../../test/factories/team.factory';
import { PlayerFactory } from '../../test/factories/player.factory';
import { UserFactory } from '../../test/factories/user.factory';

describe('MatchesService', () => {
  let service: MatchesService;
  let prisma: PrismaService;
  let teamFactory: TeamFactory;
  let playerFactory: PlayerFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchesService, PrismaService],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
    prisma = module.get<PrismaService>(PrismaService);

    const userFactory = new UserFactory(prisma);
    teamFactory = new TeamFactory(prisma, userFactory);
    playerFactory = new PlayerFactory(prisma, teamFactory);

    await cleanDatabase(prisma);
  });

  it('Should add 3 points to local team and 1 goal to player after match finishes 1-0', async () => {
    const homeTeam = await teamFactory.create();
    const awayTeam = await teamFactory.create();
    const player = await playerFactory.create({ teamId: homeTeam.id });

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
