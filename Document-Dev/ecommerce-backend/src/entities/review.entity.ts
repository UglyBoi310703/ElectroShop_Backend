import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { User } from './user.entity';
import { Order } from './order.entity';
import { ProductVariant } from './product-variant.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn({ name: 'review_id' })
  reviewId: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'order_id', nullable: true })
  orderId: number;

  @Column({ name: 'variant_id', nullable: true })
  variantId: number;

  @Column()
  rating: number;

  @Column({ length: 255, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ name: 'is_verified_purchase', default: false })
  isVerifiedPurchase: boolean;

  @Column({ name: 'is_approved', default: false })
  isApproved: boolean;

  @Column({ name: 'helpful_count', default: 0 })
  helpfulCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;
}
