import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRole } from 'src/modules/v1/user/entities/user.entity';
import { JwtAuthGuard } from 'src/modules/v1/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/v1/auth/guards/roles.guard';
import { Roles } from 'src/modules/v1/auth/decorators/roles.decorator';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Public } from 'src/modules/v1/auth/decorators/public.decorator';

@Controller({ path: 'banner', version: '1' })
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
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
  @ApiBody({
    description: 'Create Banner with images',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'banner' },
        description: { type: 'string', example: 'Best Bangladeshi Fresh milk' },
        keyword: { type: 'string', example: 'Bangladeshi, Best, Fresh milk' },
        image: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      required: ['title', 'image'],
    },
  })
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateBannerDto,
  ) {
    return this.bannerService.create(file, body);
  }

  @Get()
  @Public()
  findAll() {
    return this.bannerService.findAll();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteBanner(@Param('id') id: string) {
    return this.bannerService.deleteBanner(+id);
  }
}
