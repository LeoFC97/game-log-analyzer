import { Injectable, BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from '../entities/match.entity';
import { Kill } from '../entities/kill.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(Kill)
    private readonly killRepository: Repository<Kill>,
  ) { }

  async processLog(logContent: string): Promise<void> {
    const lines = logContent.split('\n').map(line => line.trim()).filter(Boolean);

    let currentMatchLines: string[] = [];
    let processing = false;

    for (const line of lines) {
      if (line.includes('New match')) {
        currentMatchLines = [line];
        processing = true;
        continue;
      }

      if (processing) {
        currentMatchLines.push(line);
      }

      if (line.includes('has ended') && processing) {
        await this.processMatchBlock(currentMatchLines);
        processing = false;
        currentMatchLines = [];
      }
    }
  }

  private async processMatchBlock(lines: string[]): Promise<void> {
    const matchId = lines[0].match(/New match (\d+) has started/)?.[1];
    const startedAt = this.extractDate(lines[0]);
    const endedAt = this.extractDate(lines[lines.length - 1]);

    if (!matchId || !startedAt || !endedAt) {
      throw new BadRequestException('Partida inválida no log.');
    }

    const playerSet: Set<string> = new Set();

    for (const line of lines) {
      const killMatch = line.match(/(.*?) killed (.*?) using (.*)/);
      const worldKillMatch = line.match(/<WORLD> killed (.*?) by (.*)/);

      if (killMatch) {
        const [, killer, victim] = killMatch;
        if (killer !== '<WORLD>') playerSet.add(killer);
        if (victim !== '<WORLD>') playerSet.add(victim);
      } else if (worldKillMatch) {
        const [, victim] = worldKillMatch;
        if (victim !== '<WORLD>') playerSet.add(victim);
      }
    }

    if (playerSet.size > 20) {
      throw new BadRequestException(
        `Número de jogadores excede o limite de 20 na partida ${matchId}. Foram encontrados ${playerSet.size} jogadores.`,
      );
    }

    let match = await this.matchRepository.findOne({ where: { externalId: matchId } });

    if (match?.endedAt) {
      throw new UnprocessableEntityException(`A partida ${matchId} já foi finalizada e não pode ser processada novamente.`);
    }

    if (!match) {
      match = this.matchRepository.create({
        externalId: matchId,
        startedAt,
        kills: [],
      });
      await this.matchRepository.save(match);
    }

    if (!match) {
      match = this.matchRepository.create({
        externalId: matchId,
        startedAt,
        endedAt,
        kills: [],
      });
      await this.matchRepository.save(match);
    }

    for (const line of lines) {
      const killMatch = line.match(/(.*?) killed (.*?) using (.*)/);
      const worldKillMatch = line.match(/<WORLD> killed (.*?) by (.*)/);
      const timestamp = this.extractDate(line);

      if (killMatch) {
        const [, killer, victim, weapon] = killMatch;

        const kill = this.killRepository.create({
          killer,
          victim,
          weapon,
          timestamp,
          match,
        });

        await this.killRepository.save(kill);
      }
    }

    match.endedAt = endedAt;
    await this.matchRepository.save(match);
  }

  private extractDate(line: string): Date {
    const dateStr = line.substring(0, 19);
    const [date, time] = dateStr.split(' ');
    const [day, month, year] = date.split('/');
    return new Date(`${year}-${month}-${day}T${time}`);
  }
}
