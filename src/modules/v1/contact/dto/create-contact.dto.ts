import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @Length(2, 50)
  name: string;

  @ApiProperty({ example: '+8801712345678' })
  @IsString()
  @Length(10, 15)
  phone: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'I am interested in your services.' })
  @IsString()
  @Length(5, 500)
  message: string;
}
