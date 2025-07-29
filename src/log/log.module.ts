import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogService } from './log.service';
import { Match } from '../entities/match.entity';
import { Kill } from '../entities/kill.entity';
import { LogController } from './log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Match, Kill])],
  providers: [LogService],
  exports: [LogService],
  controllers: [LogController],
})
export class LogModule {}
