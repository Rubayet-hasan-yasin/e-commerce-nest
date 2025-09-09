import { diskStorage } from 'multer';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { Roles } from 'src/modules/v1/auth/decorators/roles.decorator';
import { UserRole } from 'src/modules/v1/user/entities/user.entity';
import { JwtAuthGuard } from 'src/modules/v1/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/v1/auth/guards/roles.guard';
import { Public } from 'src/modules/v1/auth/decorators/public.decorator';

@Controller({ path: 'product', version: '1' })
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @Public()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('categoryId') categoryId?: number,
  ) {
    return this.productService.findAll(page, limit, categoryId);
  }

  @Get('featured-products')
  @Public()
  findFeaturedProducts() {
    return this.productService.findFeaturedProducts();
  }

  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    example: 'Fresh Milk',
  })
  @ApiQuery({
    name: 'currentProductId',
    required: false,
    type: Number,
    example: 10,
  })
  @Get('related-products')
  @Public()
  findRelatedProducts(
    @Query('category') category: string,
    @Query('currentProductId', ParseIntPipe) currentProductId: number,
  ) {
    return this.productService.findRelatedProducts(category, currentProductId);
  }

  @Get('search')
  @Public()
  async searchProducts(@Query('q') q: string) {
    if (!q || !q.trim()) {
      throw new BadRequestException('Search query is required');
    }
    return this.productService.searchProduct(q.trim());
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create product with images',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Fresh milk' },
        localName: { type: 'string', example: 'দুধ' },
        category: { type: 'string', example: 2 },
        description: {
          type: 'string',
          example: JSON.stringify('<p><br></p><p>dxgys</p>'),
        },
        keyword: { type: 'string', example: 'Bangladeshi, Best, Fresh milk' },
        youtubeLink: {
          type: 'string',
          example: 'https://youtube.com/video123',
        },
        sizes: {
          type: 'string',
          example: JSON.stringify([
            { weight: '1000', price: '100', discountPrice: '90' },
            { weight: '500', price: '60' },
          ]),
        },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      required: [
        'name',
        'localName',
        'category',
        'sizes',
        'images',
        'description',
        'keyword',
      ],
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 5 }], {
      storage: diskStorage({
        destination: './uploads/orginal',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  async create(
    @UploadedFiles() images: Record<string, Express.Multer.File[]>,
    @Body() productData: CreateProductDto,
  ) {
    if (!images || !images.images || images.images.length === 0) {
      throw new BadRequestException('Image is required');
    }

    await this.productService.create(productData, images.images);

    return { status: 'success', message: 'Product created successfully' };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update product with optional new images',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Updated Milk' },
        localName: { type: 'string', example: 'আপডেট দুধ' },
        category: {
          type: 'string',
          enum: [
            'Fresh Milk',
            'Pure Ghee',
            'Mustard Oil',
            'Cow & Goat',
            'Discount',
          ],
        },
        description: { type: 'string' },
        keyword: { type: 'string' },
        youtubeLink: { type: 'string' },
        sizes: {
          type: 'string',
          example: JSON.stringify([
            { weight: '1000', price: '120', discountPrice: '110' },
          ]),
        },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 5 }], {
      storage: diskStorage({
        destination: './uploads/orginal',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @UploadedFiles() images: Record<string, Express.Multer.File[]>,
    @Body() productData: UpdateProductDto,
  ) {
    console.log(images);

    return this.productService.update(+id, productData, images.images || []);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
