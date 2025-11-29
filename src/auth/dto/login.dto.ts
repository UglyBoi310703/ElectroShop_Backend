import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AddCartItemDto } from '../../cart/dto/add-cart-item.dto';

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ type: [AddCartItemDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AddCartItemDto)
  guestCartItems?: AddCartItemDto[];
}
