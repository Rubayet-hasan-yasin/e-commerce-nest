import { Test, TestingModule } from '@nestjs/testing';
import { ShippingCostService } from './shipping-cost.service';

describe('ShippingCostService', () => {
  let service: ShippingCostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShippingCostService],
    }).compile();

    service = module.get<ShippingCostService>(ShippingCostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
