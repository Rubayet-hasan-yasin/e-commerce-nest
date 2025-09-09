import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductCategory } from './entities/ProductCategory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategoryDto } from './dto/create-category.dto';
import { UpdateProductCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,
  ) {}

  findAll() {
    return this.categoryRepository.find();
  }

  async create(dto: ProductCategoryDto): Promise<ProductCategory> {
    const existing = await this.categoryRepository.findOne({
      where: { name: dto.name },
    });

    if (existing) {
      throw new BadRequestException(
        `Category name '${dto.name}' already exists.`,
      );
    }

    const category = this.categoryRepository.create(dto);
    return this.categoryRepository.save(category);
  }

  async update(
    id: number,
    dto: UpdateProductCategoryDto,
  ): Promise<ProductCategory | null> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (dto.name && dto.name !== category.name) {
      const existing = await this.categoryRepository.findOne({
        where: { name: dto.name },
      });
      if (existing) {
        throw new BadRequestException(
          `Category name '${dto.name}' already exists.`,
        );
      }
    }

    await this.categoryRepository.update(id, dto);
    const updatedCategory = await this.categoryRepository.findOneBy({ id });
    return updatedCategory;
  }
}
