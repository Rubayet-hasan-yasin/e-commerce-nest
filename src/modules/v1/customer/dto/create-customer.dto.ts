import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'kashem' })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({
    example: '01712345678',
  })
  @IsNotEmpty()
  @IsPhoneNumber('BD')
  phone: string;

  @ApiProperty({ example: '123456', description: 'User password' })
  @IsOptional()
  @IsString()
  password?: string;
}
