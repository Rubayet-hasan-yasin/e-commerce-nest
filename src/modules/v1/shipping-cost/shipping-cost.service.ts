import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateShippingCostDto } from './dto/create-shipping-cost.dto';
import { UpdateShippingCostDto } from './dto/update-shipping-cost.dto';
import { Repository } from 'typeorm';
import { ShippingCost } from './entities/shipping-cost.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ShippingCostService {
  constructor(
    @InjectRepository(ShippingCost)
    private readonly shippingCostRepository: Repository<ShippingCost>,
  ) {}

  async create(data: CreateShippingCostDto) {
    const { city, cost } = data;

    // Basic validation
    if (!city || !cost) {
      throw new BadRequestException({
        message: 'City and cost are required',
        statusCode: 400,
      });
    }

    // Check for duplicate city
    const existing = await this.shippingCostRepository.findOne({
      where: { city },
    });
    if (existing) {
      throw new ConflictException({
        message: `Shipping cost for city '${city}' already exists`,
        statusCode: 409,
      });
    }

    const newShippingCost = this.shippingCostRepository.create({ city, cost });
    await this.shippingCostRepository.save(newShippingCost);

    return {
      message: 'Shipping cost created successfully',
      data: newShippingCost,
    };
  }

  async findAll() {
    const shippingCosts = await this.shippingCostRepository.find();

    if (!shippingCosts.length) {
      throw new NotFoundException({
        error: 'No shipping costs found',
        status: 404,
      });
    }

    return shippingCosts;
  }

  async update(id: number, data: UpdateShippingCostDto) {
    const { city, cost } = data;

    // Basic validation
    if (!id || !city || !cost) {
      throw new BadRequestException({
        message: 'City and cost are required',
        statusCode: 400,
      });
    }

    const shippingCost = await this.shippingCostRepository.findOneBy({ id });

    if (!shippingCost) {
      throw new NotFoundException({
        message: `Shipping cost with ID ${id} not found`,
        statusCode: 404,
      });
    }

    shippingCost.city = city;
    shippingCost.cost = cost;

    await this.shippingCostRepository.save(shippingCost);

    return {
      message: `Shipping cost updated successfully`,
      data: shippingCost,
    };
  }
}
