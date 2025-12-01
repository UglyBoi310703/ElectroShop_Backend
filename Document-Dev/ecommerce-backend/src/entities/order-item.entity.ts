import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn({ name: 'order_item_id' })
  orderItemId: number;

  @Column({ name: 'order_id' })
  orderId: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'variant_id', nullable: true })
  variantId: number;

  @Column({ name: 'product_name', length: 500 })
  productName: string;

  @Column({ name: 'variant_name', length: 255, nullable: true })
  variantName: string;

  @Column({ name: 'product_image', length: 500, nullable: true })
  productImage: string;

  @Column({ length: 100, nullable: true })
  sku: string;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  price: number;

  @Column({ name: 'discount_amount', type: 'decimal', precision: 15, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  subtotal: number;

  @Column({ name: 'warranty_period', nullable: true })
  warrantyPeriod: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;
}
