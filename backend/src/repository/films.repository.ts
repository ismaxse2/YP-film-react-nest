import {
  FilmScheduleResponseDto,
  FilmsResponseDto,
} from '../films/dto/films.dto';
import { CreatedTicketDto, TicketDto } from '../order/dto/order.dto';

export type CreateOrderResult =
  | {
      success: true;
      tickets: CreatedTicketDto[];
    }
  | {
      success: false;
      code: 'DUPLICATE_SEAT' | 'SEAT_TAKEN_OR_SESSION_NOT_FOUND';
      place: string;
    };

export interface FilmsRepository {
  findAll(): Promise<FilmsResponseDto>;

  findScheduleByFilmId(filmId: string): Promise<FilmScheduleResponseDto>;

  createOrder(tickets: TicketDto[]): Promise<CreateOrderResult>;
}

export const FILMS_REPOSITORY = 'FILMS_REPOSITORY';
