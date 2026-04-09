import { PrismaService } from '../../src/prisma/prisma.service';
import { faker } from '@faker-js/faker';

export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async createCoach(data = {}) {
    return this.prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: 'password123',
        name: faker.person.fullName(),
        role: 'COACH 1',
        ...data,
      },
    });
  }
}
