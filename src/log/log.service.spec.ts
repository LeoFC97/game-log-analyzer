import { Test, TestingModule } from '@nestjs/testing';
import { LogService } from './log.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Match } from '../entities/match.entity';
import { Kill } from '../entities/kill.entity';

describe('LogService', () => {
  let service: LogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogService,
        { provide: getRepositoryToken(Match), useValue: {} },
        { provide: getRepositoryToken(Kill), useValue: {} },
      ],
    }).compile();

    service = module.get<LogService>(LogService);
  });

  describe('extractDate', () => {
    it('deve extrair e converter a data corretamente', () => {
      const line = '23/04/2019 15:36:04 - Roman killed Nick using M16';
      const result = service.extractDate(line);

      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).toBe('2019-04-23T15:36:04.000Z');
    });

    it('deve lançar erro se a linha estiver em formato inválido', () => {
      const badLine = 'linha inválida';

      expect(() => {
        service.extractDate(badLine);
      }).toThrow();
    });
  });
});
