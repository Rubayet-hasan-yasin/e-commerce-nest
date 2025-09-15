import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { BcryptHelper } from 'src/helpers/bcrypt.helper';

describe('CustomerController', () => {
  let controller: CustomerController;

  const mockCustomerService = {
    create: jest.fn(),
    allCustomerDetails: jest.fn(),
    findUserData: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        { provide: CustomerService, useValue: mockCustomerService },
        { provide: getRepositoryToken(Customer), useValue: {} }, // mock repository
        { provide: BcryptHelper, useValue: { hashString: jest.fn() } }, // mock BcryptHelper
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
