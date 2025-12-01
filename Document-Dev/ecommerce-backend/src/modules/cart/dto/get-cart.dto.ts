import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CartItemDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    productId: string;

    @ApiPropertyOptional()
    variantId?: string;

    @ApiProperty()
    quantity: number;

    @ApiProperty()
    price: number;

    @ApiPropertyOptional()
    subtotal?: number;
}

export class GetCartDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: string;

    @ApiProperty({ type: [CartItemDto] })
    items: CartItemDto[];

    @ApiProperty()
    totalItems: number;

    @ApiProperty()
    totalPrice: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
