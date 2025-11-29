import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  private async getOrCreateCart(userId: string) {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });
    if (!cart) {
      const user = await this.usersService.findOne(userId);
      cart = this.cartRepository.create({ user, items: [] });
      cart = await this.cartRepository.save(cart);
    }
    return cart;
  }

  async findCart(userId: string) {
    return this.getOrCreateCart(userId);
  }

  async addItem(userId: string, dto: AddCartItemDto) {
    const cart = await this.getOrCreateCart(userId);
    const product = await this.productsService.findOne(dto.productId);
    if (dto.quantity > product.stock) {
      throw new BadRequestException('Quantity exceeds stock');
    }
    const existing = cart.items.find((item) => item.product.id === product.id);
    if (existing) {
      if (existing.quantity + dto.quantity > product.stock) {
        throw new BadRequestException('Quantity exceeds stock');
      }
      existing.quantity += dto.quantity;
      await this.cartItemRepository.save(existing);
    } else {
      const cartItem = this.cartItemRepository.create({
        cart,
        product,
        quantity: dto.quantity,
      });
      cart.items.push(await this.cartItemRepository.save(cartItem));
    }
    return cart;
  }

  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.find((i) => i.id === itemId);
    if (!item) {
      throw new NotFoundException('Cart item not found');
    }
    if (dto.quantity > item.product.stock) {
      throw new BadRequestException('Quantity exceeds stock');
    }
    if (dto.quantity === 0) {
      await this.cartItemRepository.remove(item);
    } else {
      item.quantity = dto.quantity;
      await this.cartItemRepository.save(item);
    }
    return this.getOrCreateCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.find((i) => i.id === itemId);
    if (!item) {
      throw new NotFoundException('Cart item not found');
    }
    await this.cartItemRepository.remove(item);
    return this.getOrCreateCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    await this.cartItemRepository.remove(cart.items);
    cart.items = [];
    return cart;
  }

  async mergeGuestCart(userId: string, guestItems: AddCartItemDto[]) {
    const cart = await this.getOrCreateCart(userId);
    for (const item of guestItems) {
      await this.addItem(userId, item);
    }
    return cart;
  }
}
