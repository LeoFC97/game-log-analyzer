import { Test, TestingModule } from '@nestjs/testing';
import { LogModule } from './log.module';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Match } from '../entities/match.entity';
import { Kill } from '../entities/kill.entity';
import { Repository } from 'typeorm';

describe('LogModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [LogModule],
    })
      .overrideProvider(getRepositoryToken(Match))
      .useValue({}) // mock do repositório de Match
      .overrideProvider(getRepositoryToken(Kill))
      .useValue({}) // mock do repositório de Kill
      .compile();
  });

  it('deve compilar o módulo corretamente', async () => {
    expect(module).toBeDefined();
  });

  it('deve injetar o LogService corretamente', () => {
    const service = module.get<LogService>(LogService);
    expect(service).toBeDefined();
  });

  it('deve injetar o LogController corretamente', () => {
    const controller = module.get<LogController>(LogController);
    expect(controller).toBeDefined();
  });
  it('deve exportar o LogService', () => {
  const exported = module.select(LogModule).get(LogService, { strict: false });
  expect(exported).toBeInstanceOf(LogService);
});
});
