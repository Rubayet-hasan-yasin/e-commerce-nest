import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { Banner } from './entities/banner.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileUploadService } from 'src/modules/file-upload/file-upload.service';
import { Env } from 'src/config/env';
import * as fs from 'fs';
import { unlink } from 'fs/promises';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private bannerRepository: Repository<Banner>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async create(file: Express.Multer.File, dto: CreateBannerDto) {
    if (!file) {
      throw new BadRequestException('Image file is required.');
    }
    const imagePaths = await this.fileUploadService.singleImageUpload(file);

    // console.log('Image paths:', imagePaths);

    try {
      const image = this.bannerRepository.create({
        url: imagePaths.image,
        title: dto.title,
        description: dto.description,
        keyword: dto.keyword,
      });

      const savedImage = await this.bannerRepository.save(image);
      return { message: 'Image uploaded successfully', data: savedImage };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not save image.');
    }
  }

  async findAll() {
    const images = await this.bannerRepository.find();

    return images.map((image: Banner) => ({
      id: image.id,
      title: image.title,
      description: image.description,
      imageUrl: `${Env.DOMAIN}/image/${image.url}`,
    }));
  }

  async deleteBanner(id: number) {
    const banner = await this.bannerRepository.findOneBy({ id });

    if (!banner) throw new NotFoundException('Banner not found');

    const filePath = `uploads/${banner.url}`;
    console.log(filePath);

    if (fs.existsSync(filePath)) {
      await unlink(filePath);
      console.log('Original file deleted');
    } else {
      console.error('Original file not found for deletion');
    }

    await this.bannerRepository.remove(banner);
    return {
      message: 'Banner deleted successfully',
    };
  }
}
