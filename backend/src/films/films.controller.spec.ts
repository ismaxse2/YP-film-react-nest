import { Test, TestingModule } from '@nestjs/testing';

import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: {
    findAll: jest.Mock;
    findScheduleByFilmId: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      findAll: jest.fn(),
      findScheduleByFilmId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  describe('findAll', () => {
    it('should return films from service', async () => {
      const response = {
        total: 0,
        items: [],
      };

      service.findAll.mockResolvedValue(response);

      await expect(controller.findAll()).resolves.toEqual(response);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findSchedule', () => {
    it('should return film schedule from service', async () => {
      const filmId = 'film-id';

      const response = {
        total: 0,
        items: [],
      };

      service.findScheduleByFilmId.mockResolvedValue(response);

      await expect(controller.findSchedule(filmId)).resolves.toEqual(response);

      expect(service.findScheduleByFilmId).toHaveBeenCalledWith(filmId);
      expect(service.findScheduleByFilmId).toHaveBeenCalledTimes(1);
    });
  });
});
