import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  MaxLength,
  IsUrl,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Điện thoại' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  categoryName: string;

  @ApiProperty({ example: 'dien-thoai' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  slug: string;

  @ApiProperty({ example: 'Điện thoại thông minh' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '/images/category.jpg' })
  @IsUrl()
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty({ example: '/icons/category-icon.png' })
  @IsUrl()
  @IsNotEmpty()
  iconUrl: string;

  @ApiPropertyOptional({ example: '1' })
  @IsOptional()
  @IsString()
  parentId?: string;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  categoryName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  iconUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class GetCategoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  categoryName: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  iconUrl: string;

  @ApiPropertyOptional()
  parentId?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
