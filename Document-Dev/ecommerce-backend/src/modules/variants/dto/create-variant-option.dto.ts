import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUrl } from 'class-validator';

export class CreateVariantOptionDto {
    @ApiProperty({ example: '1' })
    @IsString()
    @IsNotEmpty()
    attributeId: string;

    @ApiProperty({ example: 'Đen' })
    @IsString()
    @IsNotEmpty()
    optionValue: string;

    @ApiProperty({ example: 'Black' })
    @IsString()
    @IsNotEmpty()
    optionLabel: string;

    @ApiPropertyOptional({ example: '#000000' })
    @IsOptional()
    @IsString()
    colorCode?: string;

    @ApiProperty({ example: 0 })
    @IsNumber()
    @IsNotEmpty()
    extraPrice: number;
}
