import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { BcryptHelper } from 'src/helpers/bcrypt.helper';
import { JwtHelper } from 'src/helpers/jwt.helper';

describe('AuthService', () => {
  let service: AuthService;

  // Mock objects for dependencies
  const mockUserService = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockBcryptHelper = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  const mockJwtHelper = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: BcryptHelper, useValue: mockBcryptHelper },
        { provide: JwtHelper, useValue: mockJwtHelper },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
