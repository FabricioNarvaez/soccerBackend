import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeamsModule } from './teams/teams.module';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [PrismaModule, TeamsModule, PlayersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
