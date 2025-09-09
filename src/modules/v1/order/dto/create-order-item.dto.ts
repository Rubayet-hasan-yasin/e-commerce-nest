import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 0.5, description: 'Weight per item in kg' })
  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @ApiProperty({ example: 150, description: 'Unit price of the item' })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ example: 3, description: 'ID of the selected size' })
  @IsNotEmpty()
  @IsNumber()
  sizeId: number;

  @ApiProperty({ example: 300, description: 'Total price for this line item' })
  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;
}
