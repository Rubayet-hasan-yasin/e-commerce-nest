import { PartialType } from '@nestjs/swagger';
import { ProductCategoryDto } from './create-category.dto';

export class UpdateProductCategoryDto extends PartialType(ProductCategoryDto) {}
