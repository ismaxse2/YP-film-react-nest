import { Inject, Injectable } from '@nestjs/common';

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
    const tickets = await this.filmsRepository.createOrder(order.tickets);

    return {
      total: tickets.length,
      items: tickets,
    };
  }
}
