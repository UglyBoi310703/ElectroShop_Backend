import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsNumber,
    IsBoolean,
    IsOptional,
    Min,
    MaxLength,
} from 'class-validator';

export class UpdateProductDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(500)
    productName?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(500)
    slug?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    shortDescription?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    fullDescription?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Min(0)
    basePrice?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Min(0)
    quantityInStock?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Min(0)
    weight?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    dimensions?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Min(0)
    warrantyPeriod?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    categoryId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    brandId?: string;
}
