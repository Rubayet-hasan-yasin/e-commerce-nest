import { Module } from '@nestjs/common';
import { AboutService } from './about.service';
import { AboutController } from './about.controller';
import { About } from './entities/about.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadModule } from 'src/modules/file-upload/file-upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([About]), FileUploadModule],
  controllers: [AboutController],
  providers: [AboutService],
})
export class AboutModule {}
