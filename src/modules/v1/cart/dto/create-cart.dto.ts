import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';

export class CreateCartDto {
  @IsString()
  phone: string;

  @IsNumber()
  productId: number;

  @IsString()
  productName: string;

  @IsString()
  productLocalName: string;

  @IsArray()
  @IsString({ each: true })
  productImage: string[];

  @IsNumber()
  sizeId: number;

  @IsString()
  selectedSize: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  discountPrice?: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  totalPrice: number;
}

export class BulkCreateCartDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCartDto)
  items: CreateCartDto[];

  @IsString()
  phone: string;
}
