import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';

import { configProvider } from './app.config.provider';
import { FilmsController } from './films/films.controller';
import { OrderController } from './order/order.controller';
import { FilmsService } from './films/films.service';
import { OrderService } from './order/order.service';
import { join } from 'node:path';

import { databaseProvider } from './repository/database.provider';
import { filmModelProvider } from './repository/film.model.provider';
import { FilmsMongoRepository } from './repository/films.mongo.repository';
import { FILMS_REPOSITORY } from './repository/films.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [FilmsController, OrderController],
  providers: [
    configProvider,
    databaseProvider,
    filmModelProvider,
    FilmsMongoRepository,
    {
      provide: FILMS_REPOSITORY,
      useExisting: FilmsMongoRepository,
    },
    FilmsService,
    OrderService,
  ],
})
export class AppModule {}
