import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { CategorySpecificationTemplate } from './category-specification-template.entity';

@Entity('product_specifications')
export class ProductSpecification {
  @PrimaryGeneratedColumn({ name: 'spec_id' })
  specId: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'template_id' })
  templateId: number;

  @Column({ name: 'spec_key', length: 100 })
  specKey: string;

  @Column({ name: 'spec_name', length: 255 })
  specName: string;

  @Column({ name: 'spec_value', type: 'text' })
  specValue: string;

  @Column({ name: 'spec_value_normalized', length: 255, nullable: true })
  specValueNormalized: string;

  @Column({ name: 'spec_unit', length: 50, nullable: true })
  specUnit: string;

  @Column({ name: 'spec_group', length: 100, nullable: true })
  specGroup: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => CategorySpecificationTemplate)
  @JoinColumn({ name: 'template_id' })
  template: CategorySpecificationTemplate;
}
