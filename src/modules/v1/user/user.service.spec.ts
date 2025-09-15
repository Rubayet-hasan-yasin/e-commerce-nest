import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UserRole } from './entities/user.entity'; // import the enum

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<User>;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const dto: CreateUserDto = {
      fullName: 'John Doe',
      phone: '01712345678',
      password: '123456',
      role: UserRole.CUSTOMER, // ✅ use enum
    };

    const mockUser = { ...dto, id: 1 } as User;
    mockRepository.create.mockReturnValue(mockUser);
    mockRepository.save.mockResolvedValue(mockUser);

    const result = await service.createUser(dto);

    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockUser);
  });

  it('should get user data', async () => {
    const mockUserData = {
      id: 1,
      fullName: 'John Doe',
      phone: '01712345678',
      role: UserRole.CUSTOMER,
    };
    mockRepository.findOne.mockResolvedValue(mockUserData);

    const result = await service.getUserData({
      id: 1,
      name: 'John Doe',
      phone: '01712345678',
      roles: 'customer',
    });

    expect(repo.findOne).toHaveBeenCalledWith({
      where: { phone: '01712345678' },
      select: ['id', 'fullName', 'phone', 'role'],
    });
    expect(result).toEqual(mockUserData);
  });
});
