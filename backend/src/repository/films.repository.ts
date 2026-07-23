import {
  FilmScheduleResponseDto,
  FilmsResponseDto,
} from '../films/dto/films.dto';
import { CreatedTicketDto, TicketDto } from '../order/dto/order.dto';

export interface FilmsRepository {
  findAll(): Promise<FilmsResponseDto>;

  findScheduleByFilmId(filmId: string): Promise<FilmScheduleResponseDto>;

  createOrder(tickets: TicketDto[]): Promise<CreatedTicketDto[]>;
}

export const FILMS_REPOSITORY = 'FILMS_REPOSITORY';
