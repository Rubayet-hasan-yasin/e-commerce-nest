import { Test, TestingModule } from '@nestjs/testing';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';
import { FileUploadService } from 'src/modules/file-upload/file-upload.service';

describe('BannerController', () => {
  let controller: BannerController;

  const mockBannerService = {
    create: jest.fn(),
    findAll: jest.fn(),
    remove: jest.fn(),
    update: jest.fn(),
  };

  const mockFileUploadService = {
    singleImageUpload: jest.fn(),
    multipleImageUpload: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BannerController],
      providers: [
        { provide: BannerService, useValue: mockBannerService },
        { provide: FileUploadService, useValue: mockFileUploadService },
      ],
    }).compile();

    controller = module.get<BannerController>(BannerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
