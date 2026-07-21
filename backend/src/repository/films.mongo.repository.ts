import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Model } from 'mongoose';

import {
  FilmDto,
  FilmScheduleResponseDto,
  FilmsResponseDto,
  ScheduleDto,
} from '../films/dto/films.dto';
import { CreatedTicketDto, TicketDto } from '../order/dto/order.dto';
import { FilmsRepository } from './films.repository';
import { FilmEntity, ScheduleEntity } from './schemas/film.schema';

@Injectable()
export class FilmsMongoRepository implements FilmsRepository {
  constructor(
    @Inject('FILM_MODEL')
    private readonly filmModel: Model<FilmEntity>,
  ) {}

  async findAll(): Promise<FilmsResponseDto> {
    const films = await this.filmModel.find({}).lean<FilmEntity[]>().exec();

    return {
      total: films.length,
      items: films.map((film) => this.mapFilmToDto(film)),
    };
  }

  async findScheduleByFilmId(filmId: string): Promise<FilmScheduleResponseDto> {
    const film = await this.filmModel
      .findOne({ id: filmId })
      .lean<FilmEntity>()
      .exec();

    if (!film) {
      return {
        total: 0,
        items: [],
      };
    }

    return {
      total: film.schedule.length,
      items: film.schedule.map((session) => this.mapScheduleToDto(session)),
    };
  }

  async createOrder(tickets: TicketDto[]): Promise<CreatedTicketDto[]> {
    const requestedSeats = new Set<string>();
    const createdTickets: CreatedTicketDto[] = [];

    for (const ticket of tickets) {
      const ticketKey = `${ticket.film}:${ticket.session}:${ticket.row}:${ticket.seat}`;

      if (requestedSeats.has(ticketKey)) {
        throw new BadRequestException(
          `Место ${ticket.row}:${ticket.seat} указано дважды`,
        );
      }

      requestedSeats.add(ticketKey);
    }

    for (const ticket of tickets) {
      const place = `${ticket.row}:${ticket.seat}`;

      const result = await this.filmModel.updateOne(
        {
          id: ticket.film,
          schedule: {
            $elemMatch: {
              id: ticket.session,
              taken: { $ne: place },
            },
          },
        },
        {
          $addToSet: {
            'schedule.$.taken': place,
          },
        },
      );

      if (result.modifiedCount === 0) {
        throw new BadRequestException(
          `Место ${place} уже занято или сеанс не найден`,
        );
      }

      createdTickets.push({
        ...ticket,
        id: randomUUID(),
      });
    }

    return createdTickets;
  }

  private mapFilmToDto(film: FilmEntity): FilmDto {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      image: film.image,
      cover: film.cover,
      title: film.title,
      about: film.about,
      description: film.description,
    };
  }

  private mapScheduleToDto(session: ScheduleEntity): ScheduleDto {
    return {
      id: session.id,
      daytime: session.daytime,
      hall: session.hall,
      rows: session.rows,
      seats: session.seats,
      price: session.price,
      taken: session.taken,
    };
  }
}
