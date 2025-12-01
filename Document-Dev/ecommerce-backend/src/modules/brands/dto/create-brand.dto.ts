import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUrl, MaxLength } from 'class-validator';

export class CreateBrandDto {
    @ApiProperty({ example: 'Apple' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    brandName: string;

    @ApiProperty({ example: 'apple' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    slug: string;

    @ApiProperty({ example: '/logos/apple.png' })
    @IsUrl()
    @IsNotEmpty()
    logoUrl: string;

    @ApiProperty({ example: 'Apple Inc. - Hãng sản xuất thiết bị điện tử' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 'https://www.apple.com' })
    @IsUrl()
    @IsNotEmpty()
    website: string;

    @ApiProperty({ example: 'United States' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    country: string;
}
