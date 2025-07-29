import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Match } from './match.entity';

@Entity()
export class Kill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  killer: string;

  @Column()
  victim: string;

  @Column()
  weapon: string;

  @Column()
  timestamp: Date;

  @ManyToOne(() => Match, match => match.kills, { nullable: false })
  @JoinColumn({ name: 'matchId' })
  match: Match;

  @Column()
  matchId: number;
}
