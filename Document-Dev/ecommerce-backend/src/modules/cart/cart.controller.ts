import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
    HttpStatus,
    HttpCode,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiResponse,
} from '@nestjs/swagger';
import { CartService, AddToCartDto, UpdateCartItemDto } from './cart.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get()
    @ApiOperation({ summary: 'Get user cart' })
    @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
    async getCart(@CurrentUser() user: any) {
        return this.cartService.getCart(user.userId);
    }

    @Post('items')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Add item to cart' })
    @ApiResponse({ status: 201, description: 'Item added to cart' })
    async addToCart(
        @CurrentUser() user: any,
        @Body() addToCartDto: AddToCartDto,
    ) {
        return this.cartService.addToCart(user.userId, addToCartDto);
    }

    @Put('items/:id')
    @ApiOperation({ summary: 'Update cart item quantity' })
    @ApiResponse({ status: 200, description: 'Item updated' })
    async updateCartItem(
        @CurrentUser() user: any,
        @Param('id') cartItemId: number,
        @Body() updateCartItemDto: UpdateCartItemDto,
    ) {
        return this.cartService.updateCartItem(
            user.userId,
            cartItemId,
            updateCartItemDto,
        );
    }

    @Delete('items/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Remove item from cart' })
    @ApiResponse({ status: 204, description: 'Item removed' })
    async removeFromCart(
        @CurrentUser() user: any,
        @Param('id') cartItemId: number,
    ) {
        return this.cartService.removeFromCart(user.userId, cartItemId);
    }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Clear cart' })
    @ApiResponse({ status: 204, description: 'Cart cleared' })
    async clearCart(@CurrentUser() user: any) {
        return this.cartService.clearCart(user.userId);
    }

    @Get('total')
    @ApiOperation({ summary: 'Get cart total' })
    @ApiResponse({ status: 200, description: 'Cart total retrieved' })
    async getCartTotal(@CurrentUser() user: any) {
        const total = await this.cartService.getCartTotal(user.userId);
        return { total };
    }
}
