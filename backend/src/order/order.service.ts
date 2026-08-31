import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';
import {
  FILMS_REPOSITORY,
  FilmsRepository,
} from '../repository/films.repository';

@Injectable()
export class OrderService {
  constructor(
    @Inject(FILMS_REPOSITORY)
    private readonly filmsRepository: FilmsRepository,
  ) {}

  async create(order: CreateOrderDto): Promise<OrderResponseDto> {
    const result = await this.filmsRepository.createOrder(order.tickets);

    if (!result.success) {
      if (result.code === 'DUPLICATE_SEAT') {
        throw new BadRequestException(`Место ${result.place} указано дважды`);
      }

      throw new BadRequestException(
        `Место ${result.place} уже занято или сеанс не найден`,
      );
    }

    return {
      total: result.tickets.length,
      items: result.tickets,
    };
  }
}
