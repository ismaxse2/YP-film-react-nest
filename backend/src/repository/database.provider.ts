import { Connection, createConnection } from 'mongoose';

import { AppConfig } from '../app.config.provider';

export const databaseProvider = {
  provide: 'DATABASE_CONNECTION',
  inject: ['CONFIG'],
  useFactory: async (config: AppConfig): Promise<Connection> => {
    return createConnection(config.database.url).asPromise();
  },
};
