import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: '1' })
  @IsString()
  @IsNotEmpty()
  sellerId: string;

  @ApiProperty({ example: '4' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ example: '1' })
  @IsString()
  @IsNotEmpty()
  brandId: string;

  @ApiProperty({
    example: 'iPhone 15 Pro Max',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  productName: string;

  @ApiProperty({
    example: 'iphone-15-pro-max',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  slug: string;

  @ApiProperty({ example: 'IP15PM' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  sku: string;

  @ApiProperty({
    example: 'iPhone 15 Pro Max - Titan',
  })
  @IsString()
  @IsNotEmpty()
  shortDescription: string;

  @ApiProperty({
    example: '<p>Full description with HTML</p>',
  })
  @IsString()
  @IsNotEmpty()
  fullDescription: string;

  @ApiProperty({ example: 33990000 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  basePrice: number;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  hasVariants: boolean;

  @ApiProperty({
    example: 50,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  quantityInStock: number;

  @ApiPropertyOptional({ example: 0.221 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({
    example: '159.9 x 76.7 x 8.25 mm',
  })
  @IsOptional()
  @IsString()
  dimensions?: string;

  @ApiPropertyOptional({
    example: 12,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  warrantyPeriod?: number;
}
