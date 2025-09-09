import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AboutService } from './about.service';
import { CreateAboutDto } from './dto/create-about.dto';
import { UpdateAboutDto } from './dto/update-about.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/v1/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/v1/auth/guards/roles.guard';
import { Roles } from 'src/modules/v1/auth/decorators/roles.decorator';
import { UserRole } from 'src/modules/v1/user/entities/user.entity';
import { Public } from 'src/modules/v1/auth/decorators/public.decorator';

@Controller({ path: 'about', version: '1' })
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/orginal',
        filename: (_req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  create(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: CreateAboutDto,
  ) {
    if (!image) {
      throw new BadRequestException('Image is required');
    }
    return this.aboutService.create(body, image);
  }

  @Get()
  @Public()
  findAll() {
    return this.aboutService.findAll();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.aboutService.remove(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/orginal',
        filename: (_req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  update(
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
    @Body() body: UpdateAboutDto,
  ) {
    return this.aboutService.update(+id, body, image?.filename);
  }
}
