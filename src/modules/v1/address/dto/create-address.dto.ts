import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateAddressDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Address ID (optional, auto-generated)',
  })
  @IsOptional()
  id?: number;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the customer',
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({
    example: '01712345678',
    description: 'Phone number of the customer',
  })
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('BD')
  phone: string;

  @ApiProperty({ example: '123 Street, City', description: 'Complete address' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiPropertyOptional({
    example: 'Home',
    description: 'Type of address (e.g. Home, Office)',
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({
    example: '5A',
    description: 'Apartment number (if applicable)',
  })
  @IsOptional()
  @IsString()
  apartment?: string;

  @ApiPropertyOptional({
    example: '5th',
    description: 'Floor number (if applicable)',
  })
  @IsOptional()
  @IsString()
  floor?: string;
}
