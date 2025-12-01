import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOrderDto {
    @ApiProperty({ example: '1' })
    @IsString()
    @IsNotEmpty()
    shippingAddressId: string;

    @ApiProperty({ example: 'credit_card' })
    @IsString()
    @IsNotEmpty()
    paymentMethod: string;

    @ApiPropertyOptional({ example: 'Giao hàng vào buổi sáng' })
    @IsOptional()
    @IsString()
    customerNote?: string;

    @ApiPropertyOptional({ example: 'SALE2024' })
    @IsOptional()
    @IsString()
    couponCode?: string;
}
