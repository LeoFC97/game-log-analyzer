import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { LogService } from './log.service';
  import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';
  
  @ApiTags('logs')
  @Controller('logs')
  export class LogController {
    constructor(private readonly logService: LogService) {}
  
    @Post('upload')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadLog(@UploadedFile() file: Express.Multer.File) {
      console.log('entrou no controller')
      if (!file) {
        throw new BadRequestException('Nenhum arquivo foi enviado.');
      }
  
      const content = file.buffer.toString('utf-8');
      await this.logService.processLog(content);
  
      return { message: 'Log processado com sucesso!' };
    }
  }
  