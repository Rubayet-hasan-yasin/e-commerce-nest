import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileUploadService } from 'src/modules/file-upload/file-upload.service';
import { SizeInput } from 'src/interface/SizeInput.interface';
import { Product } from './entities/product.entity';
import { DataSource, ILike, Not, QueryFailedError, Repository } from 'typeorm';
import { Size } from './entities/size.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';
import { ProductCategory } from './entities/ProductCategory.entity';
import { Env } from 'src/config/env';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,
    private readonly fileUploadService: FileUploadService,
    private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(productData: CreateProductDto, images: Express.Multer.File[]) {
    try {
      const imagePaths =
        await this.fileUploadService.compressMultipleImage(images);

      const sizesArray = JSON.parse(
        productData.sizes as unknown as string,
      ) as SizeInput[];

      const existingCategory = await this.categoryRepository.findOne({
        where: { id: +productData.category },
      });

      if (!existingCategory) throw new NotFoundException('Category not found');

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const product = new Product();
      product.name = productData.name;
      product.localName = productData.localName;
      product.category = existingCategory;
      product.productCode = productData.productCode;
      product.description = JSON.parse(productData.description) as string;
      product.keyword = productData.keyword;
      product.youtubeLink = productData.youtubeLink;
      product.image = imagePaths;

      const savedProduct = await queryRunner.manager.save(product);
      const sizes = sizesArray.map((sizeInput) => {
        const size = new Size();
        size.weight = sizeInput.weight;
        size.price = parseFloat(sizeInput.price);
        size.discountPrice = sizeInput.discountPrice
          ? parseFloat(sizeInput.discountPrice)
          : undefined;
        size.discountParsent = sizeInput.discountParsent
          ? parseFloat(sizeInput.discountParsent)
          : undefined;
        size.product = savedProduct;
        size.barCode = sizeInput.barCode;
        size.productId = savedProduct.id;
        return size;
      });

      await queryRunner.manager.save(Size, sizes);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return {
        message: 'Product created successfully',
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      console.error('Create product error:', error);
      throw new InternalServerErrorException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.message || 'Failed to create product',
      );
    }
  }

  async searchProduct(search: string) {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.sizes', 'sizes')
      .where('product.name ILIKE :search', { search: `%${search}%` })
      .orWhere('product.localName ILIKE :search', { search: `%${search}%` })
      .orWhere('similarity(product.name, :exact) > 0.3', { exact: search })
      .orWhere('similarity(product.localName, :exact) > 0.3', { exact: search })
      .orderBy('similarity(product.name, :exact)', 'DESC')
      .addOrderBy('product.name', 'ASC')
      .limit(20)
      .getMany();

    // Format results
    const formattedProducts = products.map((product) => ({
      ...product,
      image: product.image.map((url) => `${Env.DOMAIN}/image/${url}`),
      category: {
        id: product.category?.id,
        name: product.category?.name,
      },
    }));

    return formattedProducts;
  }

  async findAll(page?: number, limit?: number, categoryId?: number) {
    const take = limit ?? 0;
    const skip = page && limit ? (page - 1) * limit : 0;

    const discountCategory = await this.categoryRepository.findOne({
      where: { name: ILike('discount') },
    });

    const discountCategoryId = discountCategory?.id ?? 0;

    const isDiscountCategory = categoryId === discountCategoryId;

    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.sizes', 'size')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.isPublic = :isPublic', { isPublic: true })
      .orderBy('product.createdAt', 'ASC');

    if (isDiscountCategory) {
      // Apply discount condition: any size where discountPrice < price
      query
        // .andWhere('size.discountPrice IS NOT NULL')
        .andWhere('size.discountPrice < size.price');
    } else if (categoryId) {
      query.andWhere('category.id = :categoryId', { categoryId });
    }

    if (page && limit) {
      query.skip(skip).take(take);
    }

    const [products, total] =
      page && limit
        ? await query.getManyAndCount()
        : [await query.getMany(), 0];

    const mapped = products.map((product) => ({
      ...product,
      category: {
        id: product.category.id,
        name: product.category.name,
      },
      image:
        product.status === 1
          ? product.image.map((img) => `${Env.DOMAIN}/image/${img}`)
          : product.watermarkedImage?.map(
              (img) => `${Env.DOMAIN}/image/${img}`,
            ),
    }));

    if (page && limit) {
      return {
        total,
        page,
        limit,
        data: mapped,
      };
    }

    return mapped;
  }

  async findAllWithRedis(page?: number, limit?: number, categoryId?: number) {
    const cacheKey = `products:${page ?? 0}:${limit ?? 0}:${categoryId ?? 0}`;

    console.log('Fetching products with cache key:', cacheKey);

    // Try to get from cache first
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    const take = limit ?? 0;
    const skip = page && limit ? (page - 1) * limit : 0;

    const discountCategory = await this.categoryRepository.findOne({
      where: { name: ILike('discount') },
    });

    const discountCategoryId = discountCategory?.id ?? 0;
    const isDiscountCategory = categoryId === discountCategoryId;

    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.sizes', 'size')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.isPublic = :isPublic', { isPublic: true })
      .orderBy('product.createdAt', 'ASC');

    if (isDiscountCategory) {
      query.andWhere('size.discountPrice < size.price');
    } else if (categoryId) {
      query.andWhere('category.id = :categoryId', { categoryId });
    }

    if (page && limit) {
      query.skip(skip).take(take);
    }

    const [products, total] =
      page && limit
        ? await query.getManyAndCount()
        : [await query.getMany(), 0];

    const mapped = products.map((product) => ({
      ...product,
      category: {
        id: product.category.id,
        name: product.category.name,
      },
      image:
        product.status === 1
          ? product.image.map((img) => `${Env.DOMAIN}/image/${img}`)
          : product.watermarkedImage?.map(
              (img) => `${Env.DOMAIN}/image/${img}`,
            ),
    }));

    const result =
      page && limit ? { total, page, limit, data: mapped } : mapped;

    // Store result in cache for 60 seconds
    await this.cacheManager.set(cacheKey, result, 60);

    const keys = this.cacheManager.stores.keys();
    console.log('Redis keys:', keys);

    return result;
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id, isPublic: true },
      relations: ['sizes'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const fomatedProducts = {
      ...product,
      category: { id: product.category.id, name: product.category.name },
      image:
        product.status === 1
          ? product.image.map((img) => `${Env.DOMAIN}/image/${img}`)
          : product.watermarkedImage?.map(
              (img) => `${Env.DOMAIN}/image/${img}`,
            ),
    };

    return fomatedProducts;
  }

  async update(
    id: number,
    productData: UpdateProductDto,
    images: Express.Multer.File[],
  ) {
    const existingProduct = await this.productRepository.findOne({
      where: { id },
      relations: ['sizes'],
    });

    if (!existingProduct) throw new NotFoundException('Product not found');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let oldImagePaths: string[] = [];

    try {
      const status = productData.status ?? existingProduct.status;
      const isSold = +status === 0;

      if (images.length > 0) {
        // Store old image paths for deletion later
        oldImagePaths = isSold
          ? (existingProduct.watermarkedImage ?? [])
          : [
              ...(existingProduct.image ?? []),
              ...(existingProduct.watermarkedImage ?? []),
            ];

        // Compress and save new images
        const compressedImagePaths =
          await this.fileUploadService.compressMultipleImage(images);

        // let finalImagePaths: string[] = [];

        if (isSold) {
          const watermarkedPaths: string[] = [];

          for (const compressedPath of compressedImagePaths) {
            const watermarkedPath =
              await this.fileUploadService.addWatermark(compressedPath);

            watermarkedPaths.push(watermarkedPath);
          }

          existingProduct.watermarkedImage = watermarkedPaths;
          existingProduct.image = compressedImagePaths;
        } else {
          existingProduct.image = compressedImagePaths;
          existingProduct.watermarkedImage = undefined;
        }

        // existingProduct.image = finalImagePaths;
      } else if (isSold && existingProduct.image?.length) {
        const watermarkedPaths: string[] = [];

        for (const imgPath of existingProduct.image) {
          const watermarkedPath =
            await this.fileUploadService.addWatermark(imgPath);
          watermarkedPaths.push(watermarkedPath);
        }

        existingProduct.watermarkedImage = watermarkedPaths;
      }

      let existingCategory: ProductCategory | undefined | null;
      if (productData.category) {
        existingCategory = await this.categoryRepository.findOne({
          where: { id: +productData.category },
        });
      }

      existingProduct.name = productData.name ?? existingProduct.name;
      existingProduct.status = productData.status
        ? +productData.status
        : +existingProduct.status;
      existingProduct.localName =
        productData.localName ?? existingProduct.localName;
      existingProduct.category = existingCategory ?? existingProduct.category;
      existingProduct.description = productData.description
        ? (JSON.parse(productData.description) as string)
        : existingProduct.description;
      existingProduct.keyword = productData.keyword ?? existingProduct.keyword;
      existingProduct.youtubeLink =
        productData.youtubeLink ?? existingProduct.youtubeLink;
      existingProduct.productCode =
        productData.productCode ?? existingProduct.productCode;

      const savedProduct = await queryRunner.manager.save(existingProduct);

      // Handle sizes
      if (productData.sizes) {
        const parsedSizes = JSON.parse(productData.sizes) as SizeInput[];

        await queryRunner.manager.delete(Size, { productId: id });

        const newSizes = parsedSizes.map((sizeInput) => {
          const size = new Size();
          size.weight = sizeInput.weight;
          size.price = parseFloat(sizeInput.price);
          size.barCode = sizeInput.barCode;
          size.discountPrice = sizeInput.discountPrice
            ? parseFloat(sizeInput.discountPrice)
            : undefined;
          size.discountParsent = sizeInput.discountParsent
            ? parseFloat(sizeInput.discountParsent)
            : undefined;
          size.product = savedProduct;
          return size;
        });

        const savedSizes = await queryRunner.manager.save(Size, newSizes);
        existingProduct.sizes = savedSizes;
      }

      await queryRunner.manager.save(existingProduct);
      await queryRunner.commitTransaction();

      return { message: 'Product updated successfully' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err instanceof QueryFailedError) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const pgError = err as any; // still needed because QueryFailedError doesn't expose `code` directly

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (pgError.code === '23505') {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const detail: string = pgError.detail || '';

          if (detail.includes('barCode')) {
            throw new BadRequestException('Barcode must be unique');
          } else if (
            detail.includes('product_code') ||
            detail.includes('productCode')
          ) {
            throw new BadRequestException('Product code must be unique');
          } else {
            throw new BadRequestException(
              'Duplicate key error: some field must be unique',
            );
          }
        }
      }

      throw new InternalServerErrorException('Failed to update product');
    } finally {
      await queryRunner.release();

      console.log(oldImagePaths);

      // ✅ Delete old images AFTER successful DB commit
      for (const img of oldImagePaths) {
        const fullPath = join(__dirname, '../../uploads', img);
        console.log(`Deleting old image: ${fullPath}`);

        if (existsSync(fullPath)) {
          try {
            unlinkSync(fullPath);
          } catch (err) {
            console.error(`Failed to delete image ${fullPath}:`, err);
          }
        }
      }
    }
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    product.isPublic = false;
    await this.productRepository.save(product);

    return { message: `Product #${id} marked as deleted` };
  }

  async findFeaturedProducts() {
    // Get all category names
    const categories = await this.categoryRepository.find({
      select: ['name'],
    });

    if (categories.length === 0) {
      throw new NotFoundException('No categories found.');
    }

    const productCount = categories.length === 1 ? 4 : 2;

    // Fetch products for each category simply using find with relations
    const products = (
      await Promise.all(
        categories.map((category) =>
          this.productRepository.find({
            where: {
              isPublic: true,
              status: 1,
              category: { name: category.name },
            },
            relations: ['sizes', 'category'],
            take: productCount,
            order: { createdAt: 'DESC' },
          }),
        ),
      )
    ).flat();

    const fomatedProducts = products.map((product) => ({
      ...product,
      category: { id: product.category.id, name: product.category.name },
      image:
        product.status === 1
          ? product.image.map((img) => `${Env.DOMAIN}/image/${img}`)
          : product.watermarkedImage?.map(
              (img) => `${Env.DOMAIN}/image/${img}`,
            ),
    }));

    return fomatedProducts;
  }

  async findRelatedProducts(category: string, currentProductId: number) {
    if (!category || !currentProductId) {
      throw new BadRequestException('Missing required parameters.');
    }

    const formattedCategory = category.toLocaleLowerCase().match(/cow|got/)
      ? 'Cow Goat'
      : category;

    const relatedProducts = await this.productRepository.find({
      where: {
        category: { name: formattedCategory },
        isPublic: true,
        status: 1,
        id: Not(currentProductId),
      },
      relations: ['sizes', 'category'],
      take: 10,
      order: { createdAt: 'DESC' },
    });

    const fomatedProducts = relatedProducts.map((product) => ({
      ...product,
      category: { id: product.category.id, name: product.category.name },
      image:
        product.status === 1
          ? product.image.map((img) => `${Env.DOMAIN}/image/${img}`)
          : product.watermarkedImage?.map(
              (img) => `${Env.DOMAIN}/image/${img}`,
            ),
    }));

    return fomatedProducts;
  }
}
