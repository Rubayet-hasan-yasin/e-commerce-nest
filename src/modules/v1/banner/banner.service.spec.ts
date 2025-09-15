import { Test, TestingModule } from '@nestjs/testing';
import { BannerService } from './banner.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Banner } from './entities/banner.entity';
import { FileUploadService } from 'src/modules/file-upload/file-upload.service';

describe('BannerService', () => {
  let service: BannerService;

  const mockBannerRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
  };

  const mockFileUploadService = {
    singleImageUpload: jest.fn().mockResolvedValue({ image: 'test-image.jpg' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BannerService,
        { provide: getRepositoryToken(Banner), useValue: mockBannerRepository },
        { provide: FileUploadService, useValue: mockFileUploadService },
      ],
    }).compile();

    service = module.get<BannerService>(BannerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
