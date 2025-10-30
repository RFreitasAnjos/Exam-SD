import { ApiProperty } from '@nestjs/swagger';

export class ResponseArchiveDto {
  @ApiProperty({
    description: 'ID único do arquivo',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'Título do arquivo',
    example: 'Relatório 2025'
  })
  title: string;

  @ApiProperty({
    description: 'Descrição do arquivo',
    example: 'Relatório anual de vendas',
    required: false
  })
  description?: string;

  @ApiProperty({
    description: 'Caminho do arquivo no sistema',
    example: '/uploads/relatorio2025.pdf'
  })
  path: string;

  @ApiProperty({
    description: 'Nome do arquivo no Azure Storage',
    example: 'abc123-document.pdf'
  })
  filename: string;

  @ApiProperty({
    description: 'Autor do arquivo',
    example: 'John Doe'
  })
  author: string;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2025-10-30T10:00:00Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do registro',
    example: '2025-10-30T10:00:00Z'
  })
  updatedAt: Date;
}