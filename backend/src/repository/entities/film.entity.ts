import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ScheduleEntity } from './schedule.entity';

@Entity('films')
export class FilmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('double precision')
  rating!: number;

  @Column()
  director!: string;

  @Column('simple-array')
  tags!: string[];

  @Column()
  image!: string;

  @Column()
  cover!: string;

  @Column()
  title!: string;

  @Column()
  about!: string;

  @Column()
  description!: string;

  @OneToMany(() => ScheduleEntity, (schedule) => schedule.film)
  schedule!: ScheduleEntity[];
}
