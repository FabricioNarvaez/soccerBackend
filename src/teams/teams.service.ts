import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Team } from '@prisma/client';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const newTeam = await this.prisma.team.create({
      data: createTeamDto,
    });

    return newTeam;
  }

  async findAll() {
    const teams = await this.prisma.team.findMany({
      include: { coach: true },
    });

    return teams;
  }

  async findOne(id: number) {
    const foundTeam = await this.prisma.team.findUnique({
      where: { id },
      include: { coach: true },
    });

    return foundTeam;
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    return `This action updates a #${id} team`;
  }

  remove(id: number) {
    return `This action removes a #${id} team`;
  }
}
