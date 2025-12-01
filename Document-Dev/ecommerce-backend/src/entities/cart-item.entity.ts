import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn({ name: 'cart_item_id' })
  cartItemId: number;

  @Column({ name: 'cart_id' })
  cartId: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'variant_id', nullable: true })
  variantId: number;

  @Column({ default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  price: number;

  @CreateDateColumn({ name: 'added_at' })
  addedAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Cart, (cart) => cart.items)
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;
}
