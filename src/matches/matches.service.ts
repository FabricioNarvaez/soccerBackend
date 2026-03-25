import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Match } from '@prisma/client';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  async create(createMatchDto: CreateMatchDto): Promise<Match> {
    if(createMatchDto.homeTeamId === createMatchDto.awayTeamId) {
      throw new BadRequestException('Un equipo no puede jugar contra sí mismo.');
    }

    return await this.prisma.match.create({
      data: createMatchDto,
    });
  }

  findAll() {
    return `This action returns all matches`;
  }

  findOne(id: number) {
    return `This action returns a #${id} match`;
  }

  update(id: number, updateMatchDto: UpdateMatchDto) {
    return `This action updates a #${id} match`;
  }

  remove(id: number) {
    return `This action removes a #${id} match`;
  }
}
