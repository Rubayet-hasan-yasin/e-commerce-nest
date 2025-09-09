import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as path from 'path';
import * as sharp from 'sharp';
import { promises as fsPromises } from 'fs';
import * as fs from 'fs';
import { unlink } from 'fs/promises';

@Injectable()
export class FileUploadService {
  async singleImageUpload(
    image: Express.Multer.File,
  ): Promise<{ image: string }> {
    try {
      if (!image) {
        throw new BadRequestException('No image file provided.');
      }

      const imagePath = await this.compressImage(image.path);

      return { image: imagePath };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      console.error('Error uploading image:', error);
      throw new InternalServerErrorException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.message || 'Failed to upload and process the image.',
      );
    }
  }

  async multipleImageUpload(
    images: Express.Multer.File[],
  ): Promise<{ images: string[] }> {
    try {
      if (!images || images.length === 0) {
        throw new BadRequestException('No image files provided.');
      }

      const imagePaths = await this.compressMultipleImage(images);

      return { images: imagePaths };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      console.error('Error uploading images:', error);
      throw new InternalServerErrorException(
        'Failed to upload and process the images.',
      );
    }
  }

  async compressImage(originalPath: string): Promise<string> {
    if (!originalPath) {
      throw new Error('Original path is undefined');
    }

    // Normalize and resolve the path
    const absolutePath = path.resolve(path.normalize(originalPath));
    const extension = path.extname(absolutePath);
    const baseName = path.basename(absolutePath, extension);

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const compressedFilename = `${baseName}-${uniqueSuffix}${extension}`;

    const outputDir = path.join('./uploads', 'compressed');
    const outputPath = path.join(outputDir, compressedFilename);

    try {
      await fsPromises.mkdir(outputDir, { recursive: true });

      let image = sharp(absolutePath).resize({ width: 800 });

      // Use appropriate format based on original extension
      switch (extension) {
        case '.jpg':
        case '.jpeg':
          image = image.jpeg({ quality: 70 });
          break;
        case '.png':
          image = image.png({ quality: 70, compressionLevel: 9 });
          break;
        case '.webp':
          image = image.webp({ quality: 70 });
          break;
        default:
          throw new Error(`Unsupported image format: ${extension}`);
      }

      const buffer = await image.toBuffer();

      // Write the buffer to disk
      await fsPromises.writeFile(outputPath, buffer);
      console.log('Image compressed and saved successfully');
    } catch (err) {
      console.error('Error compressing image:', err);
      throw err;
    } finally {
      await this.deleteFileWithRetry(absolutePath);
    }

    return path.join('compressed', compressedFilename);
  }

  async compressMultipleImage(files: Express.Multer.File[]): Promise<string[]> {
    const compressedFilenames: string[] = [];

    for (const file of files) {
      const compressedFilename = await this.compressImage(file.path);
      compressedFilenames.push(compressedFilename);
    }

    return compressedFilenames;
  }

  // Retry mechanism for deleting the file
  private async deleteFileWithRetry(
    filePath: string,
    retries = 3,
    delay = 1000,
  ): Promise<void> {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        // Ensure the file exists before attempting to delete it
        if (fs.existsSync(filePath)) {
          await unlink(filePath); // Delete the file using unlink
          console.log('Original file deleted');
          break; // Break if successful
        } else {
          console.error('Original file not found for deletion');
          break; // Break if file does not exist
        }
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed to delete file:`, error);

        if (attempt < retries - 1) {
          console.log(`Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
        } else {
          console.error('Max retries reached. Unable to delete the file.');
        }
      }
    }
  }

  async addWatermark(inputPath: string): Promise<string> {
    // console.log('run addWatermark');

    const absolutePath = path.resolve(
      path.normalize(path.join('./uploads', inputPath)),
    );
    const extension = path.extname(absolutePath);
    // const baseName = path.basename(absolutePath, extension);

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const watermarkedFilename = `watermarked-${uniqueSuffix}${extension}`;

    const outputDir = path.join('./uploads', 'watermarked');
    const outputPath = path.join(outputDir, watermarkedFilename);

    const watermarkImagePath = path.join(
      process.cwd(),
      'assets',
      'images',
      'sold-out-stamp.png',
    );

    // console.log('🖼️ Input image path:', absolutePath);
    // console.log('💧 Watermark image path:', watermarkImagePath);
    // console.log('💾 Output path:', outputPath);

    try {
      await fsPromises.mkdir(outputDir, { recursive: true });

      const image = sharp(absolutePath);
      const { width = 800 } = await image.metadata();

      // Resize watermark to 50% of image width
      const watermarkBuffer = await sharp(watermarkImagePath)
        .resize({
          width: Math.round(width * 0.5),
        })
        .png()
        .toBuffer();

      await image
        .composite([
          {
            input: watermarkBuffer,
            gravity: 'center',
            // blend: 'overlay',
          },
        ])
        .toFile(outputPath);

      // console.log('Watermarked image saved at:', outputPath);
    } catch (err) {
      console.error('Error adding watermark:', err);
      throw err;
    }

    return path.join('watermarked', watermarkedFilename); // Return relative path
  }
}
