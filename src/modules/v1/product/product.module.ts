import { CategoryController } from './category.controller';
import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { FileUploadModule } from 'src/modules/file-upload/file-upload.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Size } from './entities/size.entity';
import { CategoryService } from './category.service';
import { ProductCategory } from './entities/ProductCategory.entity';

@Module({
  imports: [
    FileUploadModule,
    TypeOrmModule.forFeature([Product, Size, ProductCategory]),
  ],
  controllers: [ProductController, CategoryController],
  providers: [ProductService, CategoryService],
})
export class ProductModule {}
