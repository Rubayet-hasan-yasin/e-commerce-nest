import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

class SizeInput {
  @IsString()
  weight: string;

  @IsString()
  price: string;

  @IsString()
  barCode: string;

  @IsOptional()
  @IsString()
  discountPrice?: string | null;

  @IsOptional()
  @IsString()
  discountParsent?: string | null;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  category: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  localName: string;

  @IsNotEmpty()
  @IsString()
  productCode: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  keyword: string;

  @IsOptional()
  @IsString()
  youtubeLink?: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => SizeInput)
  sizes: SizeInput[];
}
