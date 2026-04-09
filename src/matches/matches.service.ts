import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Match, Team } from '@prisma/client';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  async create(createMatchDto: CreateMatchDto): Promise<Match> {
    if (createMatchDto.homeTeamId === createMatchDto.awayTeamId) {
      throw new BadRequestException('Un equipo no puede jugar contra sí mismo.');
    }

    return await this.prisma.match.create({
      data: createMatchDto,
    });
  }

  async findAll() {
    return await this.prisma.match.findMany({
      include: {
        homeTeam: { select: { name: true, acronym: true } },
        awayTeam: { select: { name: true, acronym: true } },
      }
    });
  }

  async update(id: number, updateMatchDto: UpdateMatchDto): Promise<Match> {
    const existingMatch = await this.prisma.match.findUnique({ where: { id } });

    if (!existingMatch) {
      throw new NotFoundException(`No se encontró el partido con ID ${id}`);
    }

    if (existingMatch.isFinished) {
      throw new BadRequestException('No se pueden modificar los resultados de un partido finalizado.');
    }

    if (!updateMatchDto.isFinished) {
      return await this.prisma.match.update({
        where: { id },
        data: updateMatchDto,
      });
    }

    const homeGoals = updateMatchDto.homeGoals ?? existingMatch.homeGoals;
    const awayGoals = updateMatchDto.awayGoals ?? existingMatch.awayGoals;

    let homePoints = 0, awayPoints = 0, homeWin = 0, awayWin = 0, draw = 0;

    if (homeGoals > awayGoals) {
      homePoints = 3; homeWin = 1;
    } else if (homeGoals < awayGoals) {
      awayPoints = 3; awayWin = 1;
    } else {
      homePoints = 1; awayPoints = 1; draw = 1;
    }

    return await this.prisma.$transaction(async (tx): Promise<Match> => {
      const { homeScorers, awayScorers, ...matchData } = updateMatchDto;
      const updatedMatch = await tx.match.update({
        where: { id },
        data: matchData,
      });

      const allScorers = [...(homeScorers ?? []), ...(awayScorers ?? [])];

      for (const playerId of allScorers) {
        await tx.player.update({
          where: { id: playerId },
          data: { goals: { increment: 1 } },
        });
      }

      await tx.team.update({
        where: { id: existingMatch.homeTeamId },
        data: {
          points: { increment: homePoints },
          played: { increment: 1 },
          won: { increment: homeWin },
          drawn: { increment: draw },
          lost: { increment: awayWin },
          goalsFor: { increment: homeGoals },
          goalsAgainst: { increment: awayGoals },
        },
      });

      await tx.team.update({
        where: { id: existingMatch.awayTeamId },
        data: {
          points: { increment: awayPoints },
          played: { increment: 1 },
          won: { increment: awayWin },
          drawn: { increment: draw },
          lost: { increment: homeWin },
          goalsFor: { increment: awayGoals },
          goalsAgainst: { increment: homeGoals },
        },
      });

      return updatedMatch;
    });
  }

  async getStandings() {
    const teams = await this.prisma.team.findMany({
      orderBy: [{ group: 'asc' },{ points: 'desc' }, { won: 'desc' }, { goalsFor: 'desc' }],
    });

    const grouped = teams.reduce(
      (acc, team) => {
        const key = team.group || 'Sin Grupo';
        if (!acc[key]) {
          acc[key] = [];
        }

        acc[key].push(team);
        return acc;
      },
      {} as Record<string, Team[]>,
    );

    return grouped;
  }

  findOne(id: number) {
    return `This action returns a #${id} match`;
  }

  remove(id: number) {
    return `This action removes a #${id} match`;
  }
}
