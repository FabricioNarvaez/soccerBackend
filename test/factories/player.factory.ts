import { PrismaService } from '../../src/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { TeamFactory } from './team.factory';

export class PlayerFactory {
  constructor(
    private prisma: PrismaService,
    private teamFactory: TeamFactory,
  ) {}

  async create(data: any = {}) {
    const teamId = data.teamId || (await this.teamFactory.create()).id;

    return this.prisma.player.create({
      data: {
        name: data.name || faker.person.fullName(),
        number: data.number ?? faker.number.int({ min: 1, max: 99 }),
        age: data.age ?? faker.number.int({ min: 16, max: 40 }),
        teamId: teamId,
      },
    });
  }

  async createMany(count: number, data: any = {}) {
    const players = [];
    for (let i = 0; i < count; i++) {
      players.push(await this.create(data));
    }
    return players;
  }
}