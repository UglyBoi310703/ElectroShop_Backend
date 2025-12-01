import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../../entities/cart.entity';
import { CartItem } from '../../entities/cart-item.entity';
import { Product } from '../../entities/product.entity';
import { ProductVariant } from '../../entities/product-variant.entity';

export class AddToCartDto {
    productId: number;
    variantId?: number;
    quantity: number;
}

export class UpdateCartItemDto {
    quantity: number;
}

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
        @InjectRepository(CartItem)
        private cartItemRepository: Repository<CartItem>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(ProductVariant)
        private variantRepository: Repository<ProductVariant>,
    ) { }

    async getOrCreateCart(userId: number): Promise<Cart> {
        let cart = await this.cartRepository.findOne({
            where: { userId },
        });

        if (!cart) {
            cart = this.cartRepository.create({ userId });
            cart = await this.cartRepository.save(cart);
        }

        return cart;
    }

    async getCart(userId: number) {
        const cart = await this.getOrCreateCart(userId);

        const items = await this.cartItemRepository.find({
            where: { cartId: cart.cartId },
            relations: ['product', 'variant'],
        });

        const totalPrice = items.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);

        return {
            cartId: cart.cartId,
            items,
            totalPrice,
            totalItems: items.length,
        };
    }

    async addToCart(
        userId: number,
        addToCartDto: AddToCartDto,
    ): Promise<CartItem> {
        const { productId, variantId, quantity } = addToCartDto;

        if (quantity <= 0) {
            throw new BadRequestException('Quantity must be greater than 0');
        }

        const cart = await this.getOrCreateCart(userId);

        const product = await this.productRepository.findOne({
            where: { productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        let price = product.basePrice;

        // If product has variants
        if (variantId) {
            const variant = await this.variantRepository.findOne({
                where: { variantId, productId },
            });

            if (!variant) {
                throw new NotFoundException('Product variant not found');
            }

            // Check stock
            if (variant.quantityInStock < quantity) {
                throw new BadRequestException('Not enough stock');
            }

            price = variant.price;
        } else {
            // Check stock for main product
            if (product.quantityInStock < quantity) {
                throw new BadRequestException('Not enough stock');
            }
        }

        // Check if item already in cart
        const existingItem = await this.cartItemRepository.findOne({
            where: {
                cartId: cart.cartId,
                productId,
                variantId: variantId || null,
            },
        });

        if (existingItem) {
            // Update quantity
            existingItem.quantity += quantity;
            return this.cartItemRepository.save(existingItem);
        }

        // Create new cart item
        const cartItem = this.cartItemRepository.create({
            cartId: cart.cartId,
            productId,
            variantId: variantId || null,
            quantity,
            price,
        });

        return this.cartItemRepository.save(cartItem);
    }

    async updateCartItem(
        userId: number,
        cartItemId: number,
        updateCartItemDto: UpdateCartItemDto,
    ): Promise<CartItem> {
        const { quantity } = updateCartItemDto;

        if (quantity <= 0) {
            throw new BadRequestException('Quantity must be greater than 0');
        }

        const cart = await this.getOrCreateCart(userId);

        const cartItem = await this.cartItemRepository.findOne({
            where: { cartItemId, cartId: cart.cartId },
        });

        if (!cartItem) {
            throw new NotFoundException('Cart item not found');
        }

        cartItem.quantity = quantity;
        return this.cartItemRepository.save(cartItem);
    }

    async removeFromCart(
        userId: number,
        cartItemId: number,
    ): Promise<{ message: string }> {
        const cart = await this.getOrCreateCart(userId);

        const cartItem = await this.cartItemRepository.findOne({
            where: { cartItemId, cartId: cart.cartId },
        });

        if (!cartItem) {
            throw new NotFoundException('Cart item not found');
        }

        await this.cartItemRepository.remove(cartItem);
        return { message: 'Item removed from cart' };
    }

    async clearCart(userId: number): Promise<{ message: string }> {
        const cart = await this.getOrCreateCart(userId);

        await this.cartItemRepository.delete({ cartId: cart.cartId });

        return { message: 'Cart cleared' };
    }

    async getCartTotal(userId: number): Promise<number> {
        const cart = await this.getOrCreateCart(userId);

        const items = await this.cartItemRepository.find({
            where: { cartId: cart.cartId },
        });

        return items.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);
    }
}
