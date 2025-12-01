import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsUrl,
    IsJSON,
    Min,
} from 'class-validator';

export class CreateProductVariantDto {
    @ApiProperty({ example: '1' })
    @IsString()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({ example: 'iPhone 15 Pro Max - Đen' })
    @IsString()
    @IsNotEmpty()
    variantName: string;

    @ApiProperty({ example: 'IP15PROMAX-BLK-256' })
    @IsString()
    @IsNotEmpty()
    sku: string;

    @ApiProperty({ example: 25999000 })
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    price: number;

    @ApiPropertyOptional({ example: 29999000 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    compareAtPrice?: number;

    @ApiPropertyOptional({ example: 15000000 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    costPrice?: number;

    @ApiProperty({ example: 100 })
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    quantityInStock: number;

    @ApiProperty({ example: '/images/iphone-15-black.jpg' })
    @IsUrl()
    @IsNotEmpty()
    imageUrl: string;

    @ApiPropertyOptional({
        example: '{"color": "1", "storage": "2"}',
    })
    @IsOptional()
    attributeValues?: Record<string, string>;
}
