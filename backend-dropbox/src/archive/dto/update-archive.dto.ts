import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateArchiveDto {
  @ApiProperty({
    description: 'Título do arquivo',
    example: 'Relatório 2025 Atualizado',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'O título deve ser uma string' })
  title?: string;

  @ApiProperty({
    description: 'Descrição do arquivo',
    example: 'Relatório anual de vendas atualizado',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string' })
  description?: string;

  @ApiProperty({
    description: 'Caminho do arquivo no sistema',
    example: '/uploads/relatorio2025_v2.pdf',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'O caminho deve ser uma string' })
  path?: string;

  @ApiProperty({
    description: 'Autor do arquivo',
    example: 'John Doe',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'O autor deve ser uma string' })
  author?: string;
}