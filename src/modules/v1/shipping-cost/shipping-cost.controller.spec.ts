import { Test, TestingModule } from '@nestjs/testing';
import { ShippingCostController } from './shipping-cost.controller';
import { ShippingCostService } from './shipping-cost.service';

describe('ShippingCostController', () => {
  let controller: ShippingCostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShippingCostController],
      providers: [ShippingCostService],
    }).compile();

    controller = module.get<ShippingCostController>(ShippingCostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
