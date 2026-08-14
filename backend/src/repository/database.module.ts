import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilmEntity } from './entities/film.entity';
import { ScheduleEntity } from './entities/schedule.entity';
import { FilmsTypeOrmRepository } from './films.typeorm.repository';
import { FILMS_REPOSITORY } from './films.repository';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,

        host: configService.getOrThrow<string>('DATABASE_HOST'),

        port: Number(configService.getOrThrow<string>('DATABASE_PORT')),

        database: configService.getOrThrow<string>('DATABASE_NAME'),

        username: configService.getOrThrow<string>('DATABASE_USERNAME'),

        password: configService.getOrThrow<string>('DATABASE_PASSWORD'),

        entities: [FilmEntity, ScheduleEntity],

        synchronize: false,
      }),
    }),

    TypeOrmModule.forFeature([FilmEntity, ScheduleEntity]),
  ],

  providers: [
    FilmsTypeOrmRepository,
    {
      provide: FILMS_REPOSITORY,
      useExisting: FilmsTypeOrmRepository,
    },
  ],

  exports: [FILMS_REPOSITORY],
})
export class DatabaseModule {}
