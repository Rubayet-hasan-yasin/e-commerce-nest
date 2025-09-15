import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BulkCreateCartDto } from './dto/create-cart.dto';

describe('CartService', () => {
  let service: CartService;
  let repo: Repository<Cart>;

  const mockRepository = {
    find: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Cart), // InjectRepository uses this token internally
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    repo = module.get<Repository<Cart>>(getRepositoryToken(Cart));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should delete existing carts and save new ones on upsertCart', async () => {
    const dto: BulkCreateCartDto = {
      phone: '1234567890',
      items: [
        {
          phone: '1234567890',
          productId: 1,
          productName: 'Test Product',
          productLocalName: 'Local Name',
          productImage: ['img1.jpg', 'img2.jpg'],
          sizeId: 1,
          selectedSize: 'M',
          price: 100,
          discountPrice: 10,
          quantity: 2,
          totalPrice: 200,
        },
      ],
    };

    mockRepository.find.mockResolvedValue([{ id: 1, phone: dto.phone }]);
    mockRepository.create.mockReturnValue(dto.items);
    mockRepository.save.mockResolvedValue(dto.items);
    mockRepository.delete.mockResolvedValue({ affected: 1 });

    const result = await service.upsertCart(dto);

    expect(mockRepository.find).toHaveBeenCalledWith({
      where: { phone: dto.phone },
    });
    expect(mockRepository.delete).toHaveBeenCalledWith([1]);
    expect(mockRepository.create).toHaveBeenCalledWith(dto.items);
    expect(mockRepository.save).toHaveBeenCalledWith(dto.items);
    expect(result).toBe('Cart updated successfully');
  });

  it('should return formatted carts on findAll', async () => {
    const mockCarts = [
      {
        phone: '123',
        price: '100',
        totalPrice: '200',
        discountPrice: '10',
      } as any,
    ];
    mockRepository.find.mockResolvedValue(mockCarts);

    const result = await service.findAll('123');

    expect(mockRepository.find).toHaveBeenCalledWith({
      where: { phone: '123' },
    });
    expect(result[0].price).toBe(100);
    expect(result[0].totalPrice).toBe(200);
    expect(result[0].discountPrice).toBe(10);
  });
});
