import { Injectable, BadRequestException } from '@nestjs/common';
import { BlobServiceClient, BlockBlobClient, ContainerClient } from '@azure/storage-blob';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';

interface UploadResult {
  url: string;
  filename: string;
}

@Injectable()
export class AzureStorageService {
  private containerName: string;
  private containerClient: ContainerClient;

  constructor(private readonly configService: ConfigService) {
    try {
      // Get configuration
      const containerName = this.configService.get<string>('AZURE_STORAGE_CONTAINER_NAME');
      const connectionString = this.configService.get<string>('AZURE_STORAGE_CONNECTION_STRING');
      
      // Validate configuration
      if (!containerName) {
        throw new Error('AZURE_STORAGE_CONTAINER_NAME não está definido no arquivo .env');
      }
      if (!connectionString) {
        throw new Error('AZURE_STORAGE_CONNECTION_STRING não está definido no arquivo .env');
      }

      this.containerName = containerName;

      // Initialize Azure Storage client
      try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        this.containerClient = blobServiceClient.getContainerClient(this.containerName);
      } catch (error) {
        console.error('Erro ao inicializar Azure Storage:', error);
        throw new Error('Connection string do Azure Storage é inválida');
      }
    } catch (error) {
      console.error('Erro na configuração do Azure Storage:', error);
      throw new Error(`Configuração do Azure Storage falhou: ${error.message}`);
    }
  }

  async uploadFile(
    file: { buffer: Buffer; originalname: string; mimetype: string; size: number }
  ): Promise<UploadResult> {
    // Validate Azure Storage configuration
    if (!this.containerClient) {
      throw new BadRequestException('Azure Storage não está configurado corretamente');
    }

    // Validate file
    if (!file || !file.buffer) {
      throw new BadRequestException('Arquivo inválido');
    }

    try {
      // Create a unique filename
      const filename = `${uuidv4()}-${file.originalname}`;
      
      // Get blob client for the file
      const blobClient = this.containerClient.getBlockBlobClient(filename);

      // Check if container exists and is accessible
      try {
        await this.containerClient.getProperties();
      } catch (error) {
        console.error('Erro ao acessar container:', error);
        throw new BadRequestException('Container do Azure Storage não está acessível. Verifique as configurações.');
      }

      // Attempt to upload
      try {
        await blobClient.upload(file.buffer, file.size, {
          blobHTTPHeaders: { blobContentType: file.mimetype }
        });
      } catch (uploadError) {
        console.error('Erro no upload para Azure:', uploadError);
        throw new BadRequestException(
          'Falha ao fazer upload para Azure Storage. ' +
          'Verifique se a connection string e as permissões estão corretas.'
        );
      }

      return {
        url: blobClient.url,
        filename: filename,
      };
    } catch (error) {
      // Log the full error for debugging
      console.error('Erro detalhado do Azure Storage:', error);
      
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      throw new BadRequestException(
        'Erro no serviço de armazenamento. ' +
        'Verifique se as variáveis de ambiente AZURE_STORAGE_CONNECTION_STRING e ' +
        'AZURE_STORAGE_CONTAINER_NAME estão configuradas corretamente.'
      );
    }
  }

  async deleteFile(filename: string): Promise<void> {
    const blobClient = this.containerClient.getBlockBlobClient(filename);
    try {
      await blobClient.delete();
    } catch (error) {
      // Log the error but don't throw to allow deleting the database record
      console.error('Error deleting file from Azure:', error);
    }
  }

  async downloadFile(filename: string): Promise<{ stream: Readable; contentType: string }> {
    const blobClient = this.containerClient.getBlockBlobClient(filename);
    try {
      const properties = await blobClient.getProperties();
      const downloadResponse = await blobClient.download();
      
      return {
        stream: downloadResponse.readableStreamBody as Readable,
        contentType: properties.contentType || 'application/octet-stream'
      };
    } catch (error) {
      throw new BadRequestException('Failed to download file from Azure Storage');
    }
  }
}