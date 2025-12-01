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

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn({ name: 'variant_id' })
  variantId: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'variant_name', length: 255 })
  variantName: string;

  @Column({ length: 100, unique: true, nullable: true })
  sku: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  price: number;

  @Column({
    name: 'compare_at_price',
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  compareAtPrice: number;

  @Column({
    name: 'cost_price',
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  costPrice: number;

  @Column({ name: 'quantity_in_stock', default: 0 })
  quantityInStock: number;

  @Column({ name: 'image_url', length: 500, nullable: true })
  imageUrl: string;

  @Column({
    name: 'attribute_values',
    type: 'json',
    comment: 'JSON: {"storage": "256GB", "color": "Black"}',
  })
  attributeValues: Record<string, string>;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
