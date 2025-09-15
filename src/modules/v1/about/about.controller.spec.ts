import { Test, TestingModule } from '@nestjs/testing';
import { AboutController } from './about.controller';
import { AboutService } from './about.service';
import { FileUploadService } from 'src/modules/file-upload/file-upload.service';

describe('AboutController', () => {
  let controller: AboutController;

  const mockAboutService = {
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
      controllers: [AboutController],
      providers: [
        { provide: AboutService, useValue: mockAboutService },
        { provide: FileUploadService, useValue: mockFileUploadService },
      ],
    }).compile();

    controller = module.get<AboutController>(AboutController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
