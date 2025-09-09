import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { QueryFailedError, Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/modules/v1/address/entities/address.entity';
import { OrderTable } from 'src/modules/v1/order/entities/order.entity';
import { BcryptHelper } from 'src/helpers/bcrypt.helper';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly bcryptHelper: BcryptHelper,
  ) {}

  async create(dto: CreateCustomerDto) {
    let hashedPassword: string | undefined = undefined;

    if (dto.password?.trim()) {
      hashedPassword = await this.bcryptHelper.hashString(dto.password);
    }

    const newCustomer = this.customerRepository.create({
      ...dto,
      password: hashedPassword,
    });

    try {
      const savedCustomer = await this.customerRepository.save(newCustomer);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = savedCustomer;
      return result;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const driverError: any = error.driverError;

        // For MySQL
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (driverError.code === 'ER_DUP_ENTRY') {
          throw new ConflictException(
            'Customer with given phone Number already exists',
          );
        }

        // For PostgreSQL
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (driverError.code === '23505') {
          throw new ConflictException(
            'Customer with given phone Number already exists',
          );
        }
      }

      throw new InternalServerErrorException(
        'Unexpected error while creating customer',
      );
    }
  }

  async findUserData(phone: string) {
    const bdPhoneRegex = /^01[3-9]\d{8}$/;

    if (!bdPhoneRegex.test(phone)) {
      throw new BadRequestException('Invalid phone number');
    }

    const customer = await this.customerRepository.findOne({
      where: { phone },
      relations: ['addresses'],
    });

    const latestAddress =
      customer?.addresses?.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      )[0] ?? null;

    if (!customer) {
      throw new BadRequestException('Customer not found');
    }

    const formatedCustomer = {
      id: customer.id,
      fullName: customer.fullName,
      phone: customer.phone,
      city: customer.city,
      address: latestAddress?.address,
      addressId: latestAddress?.id,
    };

    return formatedCustomer;
  }

  async findUserByPhone(phone: string) {
    const bdPhoneRegex = /^01[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(phone)) {
      throw new BadRequestException('Invalid phone number');
    }

    return this.customerRepository.findOneBy({ phone });
  }

  async allCustomerDetails() {
    const customers = await this.customerRepository
      .createQueryBuilder('customer')
      // Select only needed customer fields
      .select(['customer.id', 'customer.fullName', 'customer.phone'])

      // Subquery to get latest address string for customer
      .addSelect((subQuery) => {
        return subQuery
          .select('address.address')
          .from(Address, 'address')
          .where('address.customer = customer.phone')
          .orderBy('address.createdAt', 'DESC')
          .limit(1);
      }, 'latestAddress')

      // Subquery to get latest order date for customer
      .addSelect((subQuery) => {
        return subQuery
          .select('order.createdAt')
          .from(OrderTable, 'order')
          .where('order.customerId = customer.id')
          .orderBy('order.createdAt', 'DESC')
          .limit(1);
      }, 'lastOrderDate')

      .getRawMany();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return customers;
  }

  async updateCustomerPassword(phone: string, password: string) {
    const bdPhoneRegex = /^01[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(phone)) {
      throw new BadRequestException('Invalid phone number');
    }

    const customer = await this.customerRepository.findOneBy({ phone });

    if (!customer) {
      throw new BadRequestException('Customer not found');
    }

    customer.password = password;

    return this.customerRepository.save(customer);
  }
}
