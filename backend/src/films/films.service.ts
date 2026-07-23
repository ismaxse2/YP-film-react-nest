import { Inject, Injectable } from '@nestjs/common';

import { FilmScheduleResponseDto, FilmsResponseDto } from './dto/films.dto';
import {
  FILMS_REPOSITORY,
  FilmsRepository,
} from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FILMS_REPOSITORY)
    private readonly filmsRepository: FilmsRepository,
  ) {}

  findAll(): Promise<FilmsResponseDto> {
    return this.filmsRepository.findAll();
  }

  findScheduleByFilmId(id: string): Promise<FilmScheduleResponseDto> {
    return this.filmsRepository.findScheduleByFilmId(id);
  }
}
