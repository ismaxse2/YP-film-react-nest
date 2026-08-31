import { ConfigService } from '@nestjs/config';

export interface AppConfigDatabase {
  driver: string;
  host: string;
  port: number;
  name: string;
  username: string;
  password: string;
}

export interface AppConfig {
  database: AppConfigDatabase;
}

export const configProvider = {
  provide: 'CONFIG',
  inject: [ConfigService],

  useFactory: (configService: ConfigService): AppConfig => ({
    database: {
      driver: configService.get<string>('DATABASE_DRIVER', 'postgres'),

      host: configService.get<string>('DATABASE_HOST', 'localhost'),

      port: Number(configService.get<string>('DATABASE_PORT', '5432')),

      name: configService.get<string>('DATABASE_NAME', 'prac'),

      username: configService.get<string>('DATABASE_USERNAME', 'prac'),

      password: configService.get<string>('DATABASE_PASSWORD', 'prac'),
    },
  }),
};
