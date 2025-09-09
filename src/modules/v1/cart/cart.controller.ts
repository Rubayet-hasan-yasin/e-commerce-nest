import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { BulkCreateCartDto } from './dto/create-cart.dto';

@Controller({ path: 'cart', version: '1' })
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Body() createCartDto: BulkCreateCartDto) {
    return this.cartService.upsertCart(createCartDto);
  }

  @Get()
  findAll(@Query('phone') phone: string) {
    console.log(phone);

    if (!phone) {
      throw new BadRequestException('Phone number is required.');
    }

    return this.cartService.findAll(phone);
  }
}
