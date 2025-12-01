import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetProductDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    sellerId: string;

    @ApiProperty()
    categoryId: string;

    @ApiProperty()
    brandId: string;

    @ApiProperty()
    productName: string;

    @ApiProperty()
    slug: string;

    @ApiProperty()
    sku: string;

    @ApiProperty()
    shortDescription: string;

    @ApiProperty()
    fullDescription: string;

    @ApiProperty()
    basePrice: number;

    @ApiProperty()
    hasVariants: boolean;

    @ApiProperty()
    quantityInStock: number;

    @ApiPropertyOptional()
    weight?: number;

    @ApiPropertyOptional()
    dimensions?: string;

    @ApiPropertyOptional()
    warrantyPeriod?: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
