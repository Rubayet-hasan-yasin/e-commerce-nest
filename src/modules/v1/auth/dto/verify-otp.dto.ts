import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPhoneNumber } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    example: '01748570672',
    description: 'phone number (BD format)',
  })
  @IsPhoneNumber('BD')
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  otp: number;
}
