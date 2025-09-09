import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: '01712345678',
    description: 'User phone number (BD format)',
  })
  @IsPhoneNumber('BD')
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: '123456', description: 'User password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
