import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { FilmEntity } from './film.entity';

@Entity('schedules')
export class ScheduleEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  daytime!: string;

  @Column('int')
  hall!: number;

  @Column('int')
  rows!: number;

  @Column('int')
  seats!: number;

  @Column('double precision')
  price!: number;

  @Column('simple-array')
  taken!: string[];

  @Column('uuid', { nullable: true })
  filmId!: string | null;

  @ManyToOne(() => FilmEntity, (film) => film.schedule)
  @JoinColumn({ name: 'filmId' })
  film!: FilmEntity;
}
