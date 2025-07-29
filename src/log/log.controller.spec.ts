import { Test, TestingModule } from '@nestjs/testing';
import { LogController } from './log.controller';
import { LogService } from './log.service';
import { BadRequestException } from '@nestjs/common';

describe('LogController', () => {
  let controller: LogController;
  let logService: LogService;

  const mockLogService = {
    processLog: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogController],
      providers: [
        {
          provide: LogService,
          useValue: mockLogService,
        },
      ],
    }).compile();

    controller = module.get<LogController>(LogController);
    logService = module.get<LogService>(LogService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadLog', () => {
    it('deve processar o log e retornar sucesso', async () => {
      const mockFile = {
        buffer: Buffer.from('log content de teste'),
      } as Express.Multer.File;

      const result = await controller.uploadLog(mockFile);

      expect(logService.processLog).toHaveBeenCalledWith('log content de teste');
      expect(result).toEqual({ message: 'Log processado com sucesso!' });
    });

    it('deve lançar BadRequestException se o arquivo não for enviado', async () => {
      await expect(controller.uploadLog(undefined as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
