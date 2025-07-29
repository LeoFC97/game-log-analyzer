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

  @OneToMany(() => Kill, kill => kill.match, { cascade: true })
  kills: Kill[];
}
