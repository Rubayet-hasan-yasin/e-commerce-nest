import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductCategory } from './entities/ProductCategory.entity';
import { Repository, DataSource } from 'typeorm';
import { FileUploadService } from 'src/modules/file-upload/file-upload.service';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let productRepo: Repository<Product>;
  let categoryRepo: Repository<ProductCategory>;
  let fileUploadService: FileUploadService;

  const mockProduct = {
    id: 1,
    name: 'Milk',
    image: ['img.jpg'],
    category: { id: 1, name: 'Dairy' },
  };

  const mockProductRepo = {
    findOne: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([mockProduct]),
    }),
    save: jest.fn(),
  };

  const mockCategoryRepo = {
    findOne: jest.fn(),
  };

  const mockFileUploadService = {
    compressMultipleImage: jest.fn().mockResolvedValue(['compressed.jpg']),
    addWatermark: jest.fn().mockResolvedValue('watermarked.jpg'),
  };

  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        save: jest.fn().mockResolvedValue(mockProduct),
        delete: jest.fn(),
      },
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: getRepositoryToken(Product), useValue: mockProductRepo },
        {
          provide: getRepositoryToken(ProductCategory),
          useValue: mockCategoryRepo,
        },
        { provide: FileUploadService, useValue: mockFileUploadService },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepo = module.get(getRepositoryToken(Product));
    categoryRepo = module.get(getRepositoryToken(ProductCategory));
    fileUploadService = module.get<FileUploadService>(FileUploadService);
  });

  it('should create a product', async () => {
    (categoryRepo.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'Dairy',
    });

    const result = await service.create(
      {
        name: 'Milk',
        localName: 'Dudh',
        category: 1,
        sizes: '[]',
        description: '[]',
        image: [],
      } as any,
      [] as Express.Multer.File[],
    );

    expect(result).toEqual({ message: 'Product created successfully' });
  });

  it('should throw when category not found', async () => {
    (categoryRepo.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      service.create(
        {
          name: 'Milk',
          localName: 'Dudh',
          category: 99,
          sizes: '[]',
          description: '[]',
          image: [],
        } as any,
        [] as Express.Multer.File[],
      ),
    ).rejects.toThrow(NotFoundException);
  });
});
