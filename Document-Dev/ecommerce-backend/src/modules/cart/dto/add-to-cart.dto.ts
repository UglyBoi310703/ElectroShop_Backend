import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    Min,
} from 'class-validator';

export class AddToCartDto {
    @ApiProperty({ example: '1' })
    @IsString()
    @IsNotEmpty()
    productId: string;

    @ApiPropertyOptional({ example: '1' })
    @IsOptional()
    @IsString()
    variantId?: string;

    @ApiProperty({ example: 2 })
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    quantity: number;
}
