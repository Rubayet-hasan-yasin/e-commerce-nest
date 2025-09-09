import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateShippingCostDto {
  @ApiProperty({
    example: 'Inside Dhaka',
    description: 'City for which the shipping cost is applicable',
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    example: 100,
    description: 'Shipping cost for the specified city',
  })
  @IsNotEmpty()
  @IsNumber()
  cost: number;
}
