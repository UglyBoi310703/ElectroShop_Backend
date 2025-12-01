import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { User } from './user.entity';
import { Brand } from './brand.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn({ name: 'product_id' })
  productId: number;

  @Column({ name: 'seller_id' })
  sellerId: number;

  @Column({ name: 'category_id' })
  categoryId: number;

  @Column({ name: 'brand_id', nullable: true })
  brandId: number;

  @Column({ name: 'product_name', length: 500 })
  productName: string;

  @Column({ unique: true, length: 500 })
  slug: string;

  @Column({ length: 100, unique: true, nullable: true })
  sku: string;

  @Column({ name: 'short_description', type: 'text', nullable: true })
  shortDescription: string;

  @Column({ name: 'full_description', type: 'longtext', nullable: true })
  fullDescription: string;

  @Column({ name: 'base_price', type: 'decimal', precision: 15, scale: 2 })
  basePrice: number;

  @Column({ name: 'has_variants', default: false })
  hasVariants: boolean;

  @Column({ name: 'quantity_in_stock', default: 0 })
  quantityInStock: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  weight: number;

  @Column({ length: 100, nullable: true })
  dimensions: string;

  @Column({ name: 'warranty_period', nullable: true })
  warrantyPeriod: number;

  @Column({ name: 'is_featured', default: false })
  isFeatured: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: ['draft', 'active', 'out_of_stock', 'discontinued'],
    default: 'draft',
  })
  status: string;

  @Column({ name: 'view_count', default: 0 })
  viewCount: number;

  @Column({ name: 'sold_count', default: 0 })
  soldCount: number;

  @Column({
    name: 'rating_average',
    type: 'decimal',
    precision: 3,
    scale: 2,
    default: 0,
  })
  ratingAverage: number;

  @Column({ name: 'rating_count', default: 0 })
  ratingCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Brand)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  // Will be added later
  // @OneToMany(() => ProductImage, image => image.product)
  // images: ProductImage[];

  // @OneToMany(() => ProductSpecification, spec => spec.product)
  // specifications: ProductSpecification[];

  // @OneToMany(() => ProductVariant, variant => variant.product)
  // variants: ProductVariant[];
}
