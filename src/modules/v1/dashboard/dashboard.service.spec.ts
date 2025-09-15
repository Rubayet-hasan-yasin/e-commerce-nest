import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderTable } from '../order/entities/order.entity';
import { Customer } from '../customer/entities/customer.entity';
import { Product } from '../product/entities/product.entity';

describe('DashboardService', () => {
  let service: DashboardService;

  // Mock repository methods
  const mockRepo = {
    count: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getRawOne: jest.fn(),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: getRepositoryToken(OrderTable), useValue: mockRepo },
        { provide: getRepositoryToken(Customer), useValue: mockRepo },
        { provide: getRepositoryToken(Product), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return dashboard data', async () => {
    // Mock count results
    mockRepo.count
      .mockResolvedValueOnce(10) // orders
      .mockResolvedValueOnce(5) // users
      .mockResolvedValueOnce(7) // products
      .mockResolvedValueOnce(2); // dailyOrders

    // Mock total sales and daily sales
    mockRepo
      .createQueryBuilder()
      .getRawOne.mockResolvedValueOnce({ total: '1000' }) // totalSales
      .mockResolvedValueOnce({ total: '200' }); // dailySales

    const result = await service.getDashboardData();

    expect(result).toEqual([
      { title: 'Total Orders', value: '10' },
      { title: 'Total Users', value: '5' },
      { title: 'Total Sales', value: '1000.00' },
      { title: 'Total Products', value: '7' },
      { title: 'Daily Orders', value: '2' },
      { title: 'Daily Sales', value: '200.00' },
    ]);
  });
});
