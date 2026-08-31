import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { Repository } from 'typeorm';

import {
  FilmDto,
  FilmScheduleResponseDto,
  FilmsResponseDto,
  ScheduleDto,
} from '../films/dto/films.dto';

import { CreatedTicketDto, TicketDto } from '../order/dto/order.dto';

import { FilmEntity } from './entities/film.entity';
import { ScheduleEntity } from './entities/schedule.entity';
import { CreateOrderResult, FilmsRepository } from './films.repository';

@Injectable()
export class FilmsTypeOrmRepository implements FilmsRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly filmRepository: Repository<FilmEntity>,

    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
  ) {}

  async findAll(): Promise<FilmsResponseDto> {
    const films = await this.filmRepository.find({
      relations: {
        schedule: true,
      },
    });

    return {
      total: films.length,
      items: films.map((film) => this.mapFilmToDto(film)),
    };
  }

  async findScheduleByFilmId(filmId: string): Promise<FilmScheduleResponseDto> {
    const schedules = await this.scheduleRepository.find({
      where: {
        filmId,
      },
    });

    return {
      total: schedules.length,
      items: schedules.map((schedule) => this.mapScheduleToDto(schedule)),
    };
  }

  async createOrder(tickets: TicketDto[]): Promise<CreateOrderResult> {
    const requestedSeats = new Set<string>();
    const createdTickets: CreatedTicketDto[] = [];

    for (const ticket of tickets) {
      const key = `${ticket.film}:${ticket.session}:${ticket.row}:${ticket.seat}`;

      if (requestedSeats.has(key)) {
        return {
          success: false,
          code: 'DUPLICATE_SEAT',
          place: `${ticket.row}:${ticket.seat}`,
        };
      }

      requestedSeats.add(key);
    }

    for (const ticket of tickets) {
      const schedule = await this.scheduleRepository.findOne({
        where: {
          id: ticket.session,
          filmId: ticket.film,
        },
      });

      const place = `${ticket.row}:${ticket.seat}`;

      if (!schedule) {
        return {
          success: false,
          code: 'SEAT_TAKEN_OR_SESSION_NOT_FOUND',
          place,
        };
      }

      const taken = [...schedule.taken];

      if (taken.includes(place)) {
        return {
          success: false,
          code: 'SEAT_TAKEN_OR_SESSION_NOT_FOUND',
          place,
        };
      }

      taken.push(place);

      schedule.taken = taken;

      await this.scheduleRepository.save(schedule);

      createdTickets.push({
        ...ticket,
        id: randomUUID(),
      });
    }

    return {
      success: true,
      tickets: createdTickets,
    };
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
      schedule: (film.schedule ?? []).map((schedule) =>
        this.mapScheduleToDto(schedule),
      ),
    };
  }

  private mapScheduleToDto(schedule: ScheduleEntity): ScheduleDto {
    return {
      id: schedule.id,
      daytime: schedule.daytime,
      hall: schedule.hall,
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: schedule.taken,
    };
  }
}
