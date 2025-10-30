import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateArchiveDto {
  @ApiProperty({
    description: 'Título do arquivo',
    example: 'Relatório 2025'
  })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @IsString({ message: 'O título deve ser uma string' })
  title: string;

  @ApiProperty({
    description: 'Descrição do arquivo',
    example: 'Relatório anual de vendas',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string' })
  description?: string;

  @ApiProperty({
    description: 'Autor do arquivo',
    example: 'John Doe'
  })
  @IsNotEmpty({ message: 'O autor é obrigatório' })
  @IsString({ message: 'O autor deve ser uma string' })
  author: string;
}