import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class StatisticsFilterDto {
  @ApiPropertyOptional({ description: 'ISO date string' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'ISO date string' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({
    enum: ['daily', 'monthly', 'yearly'],
    default: 'daily',
  })
  @IsOptional()
  @IsIn(['daily', 'monthly', 'yearly'])
  groupBy?: 'daily' | 'monthly' | 'yearly';
}
