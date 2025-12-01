import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateVariantAttributeDto {
    @ApiProperty({ example: '1' })
    @IsString()
    @IsNotEmpty()
    categoryId: string;

    @ApiProperty({ example: 'Màu sắc' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    attributeName: string;

    @ApiProperty({ example: 'color' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    attributeKey: string;
}
