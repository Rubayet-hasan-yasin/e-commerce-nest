import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderStatusDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsNumber()
  status: number;
}
