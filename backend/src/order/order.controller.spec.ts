import { Test, TestingModule } from '@nestjs/testing';

import { CreateOrderDto } from './dto/order.dto';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;
  let service: {
    create: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  describe('create', () => {
    it('should create order through service', async () => {
      const order: CreateOrderDto = {
        email: 'test@example.com',
        phone: '+79991234567',
        tickets: [],
      };

      const response = {
        total: 0,
        items: [],
      };

      service.create.mockResolvedValue(response);

      await expect(controller.create(order)).resolves.toEqual(response);

      expect(service.create).toHaveBeenCalledWith(order);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });
});
