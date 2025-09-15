import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductCategory } from './entities/ProductCategory.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CategoryService', () => {
  let service: CategoryService;
  let repo: Repository<ProductCategory>;

  const mockCategory = { id: 1, name: 'Dairy' };

  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: getRepositoryToken(ProductCategory), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repo = module.get<Repository<ProductCategory>>(
      getRepositoryToken(ProductCategory),
    );
  });

  it('should return all categories', async () => {
    (repo.find as jest.Mock).mockResolvedValue([mockCategory]);
    const result = await service.findAll();
    expect(result).toEqual([mockCategory]);
  });

  it('should create a category', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(null);
    (repo.create as jest.Mock).mockReturnValue(mockCategory);
    (repo.save as jest.Mock).mockResolvedValue(mockCategory);

    const result = await service.create({ name: 'Dairy' });
    expect(result).toEqual(mockCategory);
  });

  it('should throw when category exists', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(mockCategory);
    await expect(service.create({ name: 'Dairy' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should update a category', async () => {
    (repo.findOneBy as jest.Mock).mockResolvedValue(mockCategory);
    (repo.update as jest.Mock).mockResolvedValue(undefined);
    (repo.findOneBy as jest.Mock).mockResolvedValue({
      ...mockCategory,
      name: 'Updated',
    });

    const result = await service.update(1, { name: 'Updated' });
    expect(result?.name).toBe('Updated');
  });

  it('should throw when updating non-existing category', async () => {
    (repo.findOneBy as jest.Mock).mockResolvedValue(null);
    await expect(service.update(99, { name: 'New' })).rejects.toThrow(
      NotFoundException,
    );
  });
});
