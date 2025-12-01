import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class SaveProductSpecDto {
    @ApiProperty({ example: '1' })
    @IsString()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({ example: '1' })
    @IsString()
    @IsNotEmpty()
    templateId: string;

    @ApiProperty({ example: 'screen_size' })
    @IsString()
    @IsNotEmpty()
    specKey: string;

    @ApiProperty({ example: 'Kích thước màn hình' })
    @IsString()
    @IsNotEmpty()
    specName: string;

    @ApiProperty({ example: '6.1' })
    @IsString()
    @IsNotEmpty()
    specValue: string;

    @ApiPropertyOptional({ example: 'inch' })
    @IsOptional()
    @IsString()
    specUnit?: string;
}
