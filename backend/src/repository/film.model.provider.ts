import { Connection, Model } from 'mongoose';

import { FilmEntity, FilmSchema } from './schemas/film.schema';

export const filmModelProvider = {
  provide: 'FILM_MODEL',
  inject: ['DATABASE_CONNECTION'],
  useFactory: (connection: Connection): Model<FilmEntity> => {
    return connection.model<FilmEntity>('Film', FilmSchema, 'films');
  },
};
