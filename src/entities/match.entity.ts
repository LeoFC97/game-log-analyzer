import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Kill } from './kill.entity';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  externalId: string;

  @Column()
  startedAt: Date;

  @Column({ nullable: true })
  endedAt?: Date;

  @Column({ nullable: true })
  winnerFavoriteWeapon?: string;

  @Column({ nullable: true })
  winner?: string;

  @OneToMany(() => Kill, kill => kill.match, { cascade: true })
  kills: Kill[];
}
