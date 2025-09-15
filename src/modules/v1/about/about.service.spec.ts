import { Test, TestingModule } from '@nestjs/testing';
import { AboutService } from './about.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { About } from './entities/about.entity';
import { FileUploadService } from 'src/modules/file-upload/file-upload.service';

describe('AboutService', () => {
  let service: AboutService;

  const mockAboutRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
  };

  const mockFileUploadService = {
    singleImageUpload: jest.fn().mockResolvedValue({ image: 'test-image.jpg' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AboutService,
        { provide: getRepositoryToken(About), useValue: mockAboutRepository },
        { provide: FileUploadService, useValue: mockFileUploadService },
      ],
    }).compile();

    service = module.get<AboutService>(AboutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
