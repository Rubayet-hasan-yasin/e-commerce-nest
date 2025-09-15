import { Test, TestingModule } from '@nestjs/testing';
import { ShippingCostService } from './shipping-cost.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShippingCost } from './entities/shipping-cost.entity';
import { Repository } from 'typeorm';
import { CreateShippingCostDto } from './dto/create-shipping-cost.dto';
import { UpdateShippingCostDto } from './dto/update-shipping-cost.dto';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

describe('ShippingCostService', () => {
  let service: ShippingCostService;
  let repo: Repository<ShippingCost>;

  const mockRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShippingCostService,
        { provide: getRepositoryToken(ShippingCost), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<ShippingCostService>(ShippingCostService);
    repo = module.get<Repository<ShippingCost>>(
      getRepositoryToken(ShippingCost),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a shipping cost', async () => {
      const dto: CreateShippingCostDto = { city: 'Dhaka', cost: 100 };
      const mockEntity = { id: 1, ...dto };

      mockRepository.findOne.mockResolvedValue(undefined);
      mockRepository.create.mockReturnValue(mockEntity);
      mockRepository.save.mockResolvedValue(mockEntity);

      const result = await service.create(dto);

      expect(result).toEqual({
        message: 'Shipping cost created successfully',
        data: mockEntity,
      });
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(mockEntity);
    });

    it('should throw ConflictException if city exists', async () => {
      mockRepository.findOne.mockResolvedValue({
        id: 1,
        city: 'Dhaka',
        cost: 100,
      });
      await expect(
        service.create({ city: 'Dhaka', cost: 100 }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException if city or cost is missing', async () => {
      // Use 0 for cost to satisfy TypeScript
      await expect(service.create({ city: '', cost: 0 })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all shipping costs', async () => {
      const data = [{ id: 1, city: 'Dhaka', cost: 100 }];
      mockRepository.find.mockResolvedValue(data);
      const result = await service.findAll();
      expect(result).toEqual(data);
    });

    it('should throw NotFoundException if none found', async () => {
      mockRepository.find.mockResolvedValue([]);
      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update shipping cost', async () => {
      const dto: UpdateShippingCostDto = { city: 'Chittagong', cost: 150 };
      const existing = { id: 1, city: 'Dhaka', cost: 100 };

      mockRepository.findOneBy.mockResolvedValue(existing);
      mockRepository.save.mockResolvedValue({ ...existing, ...dto });

      const result = await service.update(1, dto);
      expect(result).toEqual({
        message: 'Shipping cost updated successfully',
        data: { ...existing, ...dto },
      });
    });

    it('should throw NotFoundException if ID not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(undefined);
      await expect(service.update(1, { city: 'X', cost: 10 })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if ID, city or cost missing', async () => {
      // Use 0 for cost and 0 for id to satisfy TypeScript
      await expect(service.update(0, { city: '', cost: 0 })).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
