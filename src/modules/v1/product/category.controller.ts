import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ProductCategoryDto } from './dto/create-category.dto';
import { UpdateProductCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/modules/v1/auth/decorators/roles.decorator';
import { UserRole } from 'src/modules/v1/user/entities/user.entity';
import { JwtAuthGuard } from 'src/modules/v1/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/v1/auth/guards/roles.guard';

@Controller({ path: 'categories', version: '1' })
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  createCategory(@Body() dto: ProductCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateProductCategoryDto) {
    return this.categoryService.update(+id, dto);
  }
}
