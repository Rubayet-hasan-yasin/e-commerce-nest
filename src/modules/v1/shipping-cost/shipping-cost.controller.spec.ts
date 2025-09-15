import { Test, TestingModule } from '@nestjs/testing';
import { ShippingCostController } from './shipping-cost.controller';
import { ShippingCostService } from './shipping-cost.service';

describe('ShippingCostController', () => {
  let controller: ShippingCostController;

  const mockShippingCostService = {
    create: jest.fn(),
    findAll: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShippingCostController],
      providers: [
        { provide: ShippingCostService, useValue: mockShippingCostService },
      ],
    }).compile();

    controller = module.get<ShippingCostController>(ShippingCostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
