import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderTable } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { DataSource } from 'typeorm';

describe('OrderController', () => {
  let controller: OrderController;

  const mockOrderService = {
    // mock the methods your controller uses
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        { provide: OrderService, useValue: mockOrderService },
        { provide: getRepositoryToken(OrderTable), useValue: {} }, // mock OrderTableRepository
        { provide: getRepositoryToken(OrderItem), useValue: {} }, // mock OrderItemRepository
        { provide: DataSource, useValue: {} }, // mock DataSource
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
