import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Archive } from '../archive.entity';
import { Repository } from 'typeorm';
import { CreateArchiveDto } from '../dto/create-archive.dto';
import { UpdateArchiveDto } from '../dto/update-archive.dto';
import { ResponseArchiveDto } from '../dto/response-archive.dto';
import { AzureStorageService } from '../../config/storage/azure-storage.service';
import { Readable } from 'stream';

@Injectable()
export class ArchiveService {
  constructor(
    @InjectRepository(Archive)
    private readonly archiveRepository: Repository<Archive>,
    private readonly azureStorageService: AzureStorageService,
  ) {}

  private toResponseDto(archive: Archive): ResponseArchiveDto {
    const response = new ResponseArchiveDto();
    Object.assign(response, archive);
    return response;
  }

  async uploadFile(
    file: { buffer: Buffer; originalname: string; mimetype: string; size: number },
    createArchiveDto: CreateArchiveDto
  ): Promise<ResponseArchiveDto> {
    if (!file) {
      throw new BadRequestException('Arquivo não fornecido');
    }

    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('Arquivo vazio');
    }

    if (!createArchiveDto.title) {
      throw new BadRequestException('Título é obrigatório');
    }

    if (!createArchiveDto.author) {
      throw new BadRequestException('Autor é obrigatório');
    }

    try {
      const { url, filename } = await this.azureStorageService.uploadFile(file);

      const archive = this.archiveRepository.create({
        ...createArchiveDto,
        path: url,
        filename: filename
      });

      const savedArchive = await this.archiveRepository.save(archive);
      return this.toResponseDto(savedArchive);
    } catch (error) {
      console.error('Erro no upload:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Falha ao fazer upload do arquivo. Verifique as configurações do Azure Storage.');
    }
  }

  async downloadFile(id: number): Promise<{ stream: Readable; filename: string; contentType: string }> {
    const archive = await this.findOne(id);
    try {
      const { stream, contentType } = await this.azureStorageService.downloadFile(archive.filename);
      return {
        stream,
        filename: archive.filename,
        contentType
      };
    } catch (error) {
      throw new NotFoundException('File not found in storage');
    }
  }

  async getFileUrl(id: number): Promise<string> {
    const archive = await this.findOne(id);
    return archive.path;
  }

  async findAll(): Promise<ResponseArchiveDto[]> {
    const archives = await this.archiveRepository.find();
    return archives.map(archive => this.toResponseDto(archive));
  }

  async findOne(id: number): Promise<ResponseArchiveDto> {
    const archive = await this.archiveRepository.findOneBy({ id });
    if (!archive) {
      throw new NotFoundException(`Arquivo com ID ${id} não encontrado`);
    }
    return this.toResponseDto(archive);
  }

}
