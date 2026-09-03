import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { FILMS_REPOSITORY } from '../repository/films.repository';
import { CreateOrderDto } from './dto/order.dto';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;
  let repository: {
    createOrder: jest.Mock;
  };

  beforeEach(async () => {
    repository = {
      createOrder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: FILMS_REPOSITORY,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should return created tickets', async () => {
    const order: CreateOrderDto = {
      email: 'test@example.com',
      phone: '+79999999999',
      tickets: [
        {
          film: 'film-id',
          session: 'session-id',
          row: 1,
          seat: 2,
          daytime: '2026-09-01T18:00:00.000Z',
          price: 500,
        },
      ],
    };

    const tickets = [
      {
        ...order.tickets[0],
        id: 'ticket-id',
      },
    ];

    repository.createOrder.mockResolvedValue({
      success: true,
      tickets,
    });

    await expect(service.create(order)).resolves.toEqual({
      total: 1,
      items: tickets,
    });

    expect(repository.createOrder).toHaveBeenCalledWith(order.tickets);
  });

  it('should throw BadRequestException for duplicate seat', async () => {
    const order: CreateOrderDto = {
      email: 'test@example.com',
      phone: '+79999999999',
      tickets: [],
    };

    repository.createOrder.mockResolvedValue({
      success: false,
      code: 'DUPLICATE_SEAT',
      place: '1:2',
    });

    await expect(service.create(order)).rejects.toThrow(
      new BadRequestException('Место 1:2 указано дважды'),
    );
  });

  it('should throw BadRequestException if seat is taken or session not found', async () => {
    const order: CreateOrderDto = {
      email: 'test@example.com',
      phone: '+79999999999',
      tickets: [],
    };

    repository.createOrder.mockResolvedValue({
      success: false,
      code: 'SEAT_TAKEN_OR_SESSION_NOT_FOUND',
      place: '1:2',
    });

    await expect(service.create(order)).rejects.toThrow(
      new BadRequestException('Место 1:2 уже занято или сеанс не найден'),
    );
  });
});
