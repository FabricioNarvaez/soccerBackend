import { PrismaService } from '../../src/prisma/prisma.service';
import { faker } from '@faker-js/faker';

export class TeamFactory {
  constructor(private prisma: PrismaService, private userFactory: UserFactory) {}

  async create(data: any = {}) {
    const coachId = data.coachId || (await this.userFactory.createCoach()).id;

    return this.prisma.team.create({
      data: {
        name: faker.company.name(),
        acronym: faker.string.alpha(3).toUpperCase(),
        coachId,
        group: 'A',
        ...data,
      },
    });
  }
}
