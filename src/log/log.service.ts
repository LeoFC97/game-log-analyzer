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
      }
    }

    if (playerSet.size > 20) {
      throw new BadRequestException(
        `Número de jogadores excede o limite de 20 na partida ${matchId}. Foram encontrados ${playerSet.size} jogadores.`,
      );
    }

    let match = await this.matchRepository.findOne({ where: { externalId: matchId } });

    if (!match) {
      match = this.matchRepository.create({
        externalId: matchId,
        startedAt,
        endedAt,
        kills: [],
      });
      console.log('criando match....')
      await this.matchRepository.save(match);
    }

    for (const line of lines) {
      const timestamp = this.extractDate(line);
      const lineWithoutTimestamp = line.substring(22); // remove "dd/MM/yyyy HH:mm:ss - "
      const killMatch = lineWithoutTimestamp.match(/(.*?) killed (.*?) using (.*)/);

      if (killMatch) {
        const [, killer, victim, weapon] = killMatch;

        const kill = this.killRepository.create({
          killer,
          victim,
          weapon,
          timestamp,
          matchId: match.id,
        });
        console.log('salvando no banco a kill: ', kill)
        await this.killRepository.save(kill);
      }
    }
    await this.calculateWinnerFavoriteWeapon(match);
  }

  private async calculateWinnerFavoriteWeapon(match: Match): Promise<void> {
    const kills = await this.killRepository.find({
      where: { matchId: match.id },
    });

    console.log('kills')
    console.log(kills)
    console.log('kills')

    const fragCount: Record<string, number> = {};
    for (const kill of kills) {
      fragCount[kill.killer] = (fragCount[kill.killer] || 0) + 1;
    }

    const winner = Object.entries(fragCount).sort((a, b) => b[1] - a[1])[0]?.[0];

    console.log('winner')
    console.log(winner)
    console.log('winner')

    if (!winner) return;

    const winnerKills = kills.filter(k => k.killer === winner);
    const weaponCount: Record<string, number> = {};
    for (const kill of winnerKills) {
      weaponCount[kill.weapon] = (weaponCount[kill.weapon] || 0) + 1;
    }

    const winnerFavoriteWeapon = Object.entries(weaponCount).sort((a, b) => b[1] - a[1])[0]?.[0];

    console.log('favoriteWeapon')
    console.log(winnerFavoriteWeapon)
    console.log('favoriteWeapon')
    await this.matchRepository.update(match.id, {
      winner,
      winnerFavoriteWeapon
    });
  }

  public extractDate(line: string): Date {
    const dateStr = line.substring(0, 19);
    const [date, time] = dateStr.split(' ');
    const [day, month, year] = date.split('/');
    const [hours, minutes, seconds] = time.split(':').map(Number);

    const utcTimestamp = Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      hours,
      minutes,
      seconds,
    );

    const dateObj = new Date(utcTimestamp);

    if (isNaN(dateObj.getTime())) {
      throw new BadRequestException(`Data inválida no log: "${dateStr}"`);
    }

    return dateObj;
  }
}
