import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArchiveController } from './controller/archive.controller';
import { ArchiveService } from './service/archive.service';
import { Archive } from './archive.entity';
import { AzureStorageService } from '../config/storage/azure-storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Archive])],
  controllers: [ArchiveController],
  providers: [ArchiveService, AzureStorageService],
  exports: [ArchiveService]
})
export class ArchiveModule {}
