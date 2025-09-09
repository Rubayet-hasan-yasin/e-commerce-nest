import { Injectable } from '@nestjs/common';
import { BulkCreateCartDto } from './dto/create-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}
  async upsertCart(createCartDto: BulkCreateCartDto) {
    const existingCarts = await this.cartRepository.find({
      where: { phone: createCartDto.phone },
    });

    if (existingCarts.length > 0) {
      await this.cartRepository.delete(existingCarts.map((c) => c.id));
    }

    const newCartItems = this.cartRepository.create(createCartDto.items);
    await this.cartRepository.save(newCartItems);

    return 'Cart updated successfully';
  }

  async findAll(phone: string) {
    const carts = await this.cartRepository.find({ where: { phone } });
    return carts.map(({ ...rest }) => ({
      ...rest,
      totalPrice: Number(rest.totalPrice),
      price: Number(rest.price),
      discountPrice: Number(rest.discountPrice),
    }));
  }
}
