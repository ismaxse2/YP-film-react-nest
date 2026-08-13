import { BadRequestException, Injectable } from '@nestjs/common';
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
import { FilmsRepository } from './films.repository';

@Injectable()
export class FilmsTypeOrmRepository implements FilmsRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly filmRepository: Repository<FilmEntity>,

    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
  ) {}

  async findAll(): Promise<FilmsResponseDto> {
    const films = await this.filmRepository.find();

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

  async createOrder(tickets: TicketDto[]): Promise<CreatedTicketDto[]> {
    const requestedSeats = new Set<string>();
    const createdTickets: CreatedTicketDto[] = [];

    for (const ticket of tickets) {
      const key = `${ticket.film}:${ticket.session}:${ticket.row}:${ticket.seat}`;

      if (requestedSeats.has(key)) {
        throw new BadRequestException(
          `Место ${ticket.row}:${ticket.seat} указано дважды`,
        );
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
        throw new BadRequestException(
          `Место ${place} уже занято или сеанс не найден`,
        );
      }

      const taken = schedule.taken
        ? schedule.taken.split(',').filter(Boolean)
        : [];

      if (taken.includes(place)) {
        throw new BadRequestException(
          `Место ${place} уже занято или сеанс не найден`,
        );
      }

      taken.push(place);

      schedule.taken = taken.join(',');

      await this.scheduleRepository.save(schedule);

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
      tags: film.tags ? film.tags.split(',') : [],
      image: film.image,
      cover: film.cover,
      title: film.title,
      about: film.about,
      description: film.description,
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
      taken: schedule.taken ? schedule.taken.split(',').filter(Boolean) : [],
    };
  }
}
