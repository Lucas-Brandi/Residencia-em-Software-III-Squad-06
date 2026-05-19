import { IsDateString, IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterDashboardDto {
  @ApiPropertyOptional({
    description: 'Data inicial para filtro (formato ISO 8601)',
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Data final para filtro (formato ISO 8601)',
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Filtro por título (busca case-insensitive)',
    example: 'fix bug',
  })
  @IsOptional()
  @IsString()
  title?: string;
}
