import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, MaxLength } from 'class-validator';

export class UpdateBrandDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(255)
    brandName?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(255)
    slug?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUrl()
    logoUrl?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUrl()
    website?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(100)
    country?: string;
}
