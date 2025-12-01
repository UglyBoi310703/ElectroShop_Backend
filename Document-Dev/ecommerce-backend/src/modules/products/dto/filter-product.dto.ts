import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNumber,
    IsOptional,
    Min,
    Max,
    IsEnum,
} from 'class-validator';

enum SortBy {
    PRICE_ASC = 'price-asc',
    PRICE_DESC = 'price-desc',
    NEWEST = 'newest',
    POPULAR = 'popular',
    RATING = 'rating',
    PRICE = 'price',
    CREATED_AT = 'createdAt',
}

export class FilterProductDto {
    @ApiPropertyOptional({ example: '4' })
    @IsOptional()
    @IsString()
    categoryId?: string;

    @ApiPropertyOptional({ example: '1' })
    @IsOptional()
    @IsString()
    brandId?: string;

    @ApiPropertyOptional({ example: 0 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    minPrice?: number;

    @ApiPropertyOptional({ example: 50000000 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    maxPrice?: number;

    @ApiPropertyOptional({ example: 'iPhone' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ example: 20 })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number = 20;

    @ApiPropertyOptional({ enum: SortBy, example: 'newest' })
    @IsOptional()
    @IsEnum(SortBy)
    sortBy?: SortBy | string = SortBy.NEWEST;
}
