import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, UseInterceptors, UploadedFile, Res, StreamableFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import type { Response } from 'express';
import { ArchiveService } from '../service/archive.service';
import { CreateArchiveDto } from '../dto/create-archive.dto';
import { UpdateArchiveDto } from '../dto/update-archive.dto';
import { ResponseArchiveDto } from '../dto/response-archive.dto';
import type { UploadedFiles } from '../../config/interface/UploadedFile';

@ApiTags('archives')
@Controller('archives')
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, callback) => {
        if (!file) {
          return callback(new Error('Nenhum arquivo foi enviado'), false);
        }
        
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|doc|docx|xls|xlsx)$/)) {
          return callback(new Error('Apenas arquivos nos formatos: jpg, jpeg, png, gif, pdf, doc, docx, xls, xlsx são permitidos!'), false);
        }
        callback(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload de um novo arquivo' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'title', 'author'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo para upload (max 5MB)',
        },
        title: {
          type: 'string',
          description: 'Título do arquivo (obrigatório)',
        },
        description: {
          type: 'string',
          description: 'Descrição do arquivo (opcional)',
        },
        author: {
          type: 'string',
          description: 'Autor do arquivo (obrigatório)',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Arquivo enviado com sucesso', type: ResponseArchiveDto })
  async uploadFile(
    @UploadedFile() file: UploadedFiles,
    @Body() createArchiveDto: CreateArchiveDto,
  ): Promise<ResponseArchiveDto> {
    if (!file) {
      throw new BadRequestException('O arquivo é obrigatório');
    }
    return this.archiveService.uploadFile(file, createArchiveDto);
  }

  @Get('download/:id')
  @ApiOperation({ summary: 'Download de um arquivo' })
  @ApiResponse({ status: 200, description: 'Download do arquivo iniciado com sucesso' })
  async downloadFile(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const { stream, filename, contentType } = await this.archiveService.downloadFile(id);
    
    res.set({
      'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
      'Content-Type': contentType,
    });

    return new StreamableFile(stream);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os arquivos' })
  @ApiResponse({ status: 200, description: 'Lista de arquivos retornada com sucesso', type: [ResponseArchiveDto] })
  async findAll(): Promise<ResponseArchiveDto[]> {
    return this.archiveService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um arquivo pelo ID' })
  @ApiResponse({ status: 200, description: 'Arquivo encontrado com sucesso', type: ResponseArchiveDto })
  @ApiResponse({ status: 404, description: 'Arquivo não encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseArchiveDto> {
    return this.archiveService.findOne(id);
  }

}
