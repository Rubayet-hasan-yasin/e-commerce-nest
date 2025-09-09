import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAboutDto } from './dto/create-about.dto';
import { UpdateAboutDto } from './dto/update-about.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { About } from './entities/about.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { FileUploadService } from 'src/modules/file-upload/file-upload.service';
import { Env } from 'src/config/env';

@Injectable()
export class AboutService {
  constructor(
    @InjectRepository(About)
    private readonly aboutRepository: Repository<About>,
    private readonly fileUploadService: FileUploadService,
  ) {}
  async create(dto: CreateAboutDto, imageName: Express.Multer.File) {
    const imagePaths =
      await this.fileUploadService.singleImageUpload(imageName);

    try {
      const about = this.aboutRepository.create({
        ...dto,
        imageUrl: imagePaths.image,
      });
      return await this.aboutRepository.save(about);
    } catch {
      throw new InternalServerErrorException('Creation failed');
    }
  }

  async findAll() {
    const data = await this.aboutRepository.find({ order: { order: 'ASC' } });

    return data.map((d) => ({
      ...d,
      imageUrl: `${Env.DOMAIN}/image/${d.imageUrl}`,
    }));
  }

  async remove(id: number) {
    const content = await this.aboutRepository.findOneBy({ id });
    if (!content) throw new NotFoundException('Content not found');

    await this.aboutRepository.delete(id);

    const imagePath = path.join(process.cwd(), 'uploads', content.imageUrl);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    return { message: 'Deleted successfully' };
  }

  async update(id: number, dto: UpdateAboutDto, imageName?: string) {
    const content = await this.aboutRepository.findOneBy({ id });
    if (!content) throw new NotFoundException('Content not found');

    if (imageName && content.imageUrl) {
      const oldImagePath = path.join(
        process.cwd(),
        'uploads',
        content.imageUrl,
      );
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    const updated = await this.aboutRepository.save({
      ...content,
      ...dto,
      imageUrl: imageName || content.imageUrl,
    });

    return updated;
  }
}
