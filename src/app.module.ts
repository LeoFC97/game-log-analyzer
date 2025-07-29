import { Module } from '@nestjs/common';
import { MatchModule } from './match/match.module';
import { PlayerModule } from './player/player.module';
import { KillModule } from './kill/kill.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { Kill } from './entities/kill.entity';
import { LogModule } from './log/log.module';


@Module({
  imports: [LogModule, MatchModule, PlayerModule, KillModule, TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'game-log.db',
    entities: [Match, Kill],
    synchronize: true,
  })],
})
export class AppModule { }
