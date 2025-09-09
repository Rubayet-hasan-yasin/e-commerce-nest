import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPhoneNumber } from 'class-validator';

export class LoginWithOtpDto {
  @ApiProperty({
    example: '01712345678',
    description: 'User phone number (BD format)',
  })
  @IsPhoneNumber('BD')
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: '1234', description: 'User password' })
  @IsNotEmpty()
  @IsNumber()
  otp: number;
}
