import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator';

export class ResetPasswordDto {
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

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
