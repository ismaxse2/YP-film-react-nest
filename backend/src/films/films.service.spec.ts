import { Test, TestingModule } from '@nestjs/testing';

import { FILMS_REPOSITORY } from '../repository/films.repository';
import { FilmsService } from './films.service';

describe('FilmsService', () => {
  let service: FilmsService;
  let repository: {
    findAll: jest.Mock;
    findScheduleByFilmId: jest.Mock;
  };

  beforeEach(async () => {
    repository = {
      findAll: jest.fn(),
      findScheduleByFilmId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: FILMS_REPOSITORY,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
  });

  it('should return all films from repository', async () => {
    const response = {
      total: 0,
      items: [],
    };

    repository.findAll.mockResolvedValue(response);

    await expect(service.findAll()).resolves.toEqual(response);

    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return film schedule from repository', async () => {
    const filmId = 'film-id';

    const response = {
      total: 0,
      items: [],
    };

    repository.findScheduleByFilmId.mockResolvedValue(response);

    await expect(service.findScheduleByFilmId(filmId)).resolves.toEqual(
      response,
    );

    expect(repository.findScheduleByFilmId).toHaveBeenCalledWith(filmId);
    expect(repository.findScheduleByFilmId).toHaveBeenCalledTimes(1);
  });
});
