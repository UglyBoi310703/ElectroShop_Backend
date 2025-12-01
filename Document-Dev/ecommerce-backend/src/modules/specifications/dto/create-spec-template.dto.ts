import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsBoolean,
    IsArray,
    MaxLength,
} from 'class-validator';

export class CreateSpecTemplateDto {
    @ApiProperty({ example: '1' })
    @IsString()
    @IsNotEmpty()
    categoryId: string;

    @ApiProperty({ example: 'Kích thước màn hình' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    specName: string;

    @ApiProperty({ example: 'screen_size' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    specKey: string;

    @ApiProperty({ example: 'Màn hình' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    specGroup: string;

    @ApiProperty({ example: 'text' })
    @IsString()
    @IsNotEmpty()
    specType: string;

    @ApiPropertyOptional({ example: 'inch' })
    @IsOptional()
    @IsString()
    specUnit?: string;

    @ApiPropertyOptional({ example: ['5.5', '6.0', '6.5'] })
    @IsOptional()
    @IsArray()
    specOptions?: string[];

    @ApiProperty({ example: true })
    @IsBoolean()
    @IsNotEmpty()
    isRequired: boolean;

    @ApiProperty({ example: true })
    @IsBoolean()
    @IsNotEmpty()
    isFilterable: boolean;

    @ApiProperty({ example: false })
    @IsBoolean()
    @IsNotEmpty()
    isVariantOption: boolean;
}
