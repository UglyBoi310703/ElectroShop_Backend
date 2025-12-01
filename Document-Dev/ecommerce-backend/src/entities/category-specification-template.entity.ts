import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity('category_specification_templates')
export class CategorySpecificationTemplate {
  @PrimaryGeneratedColumn({ name: 'template_id' })
  templateId: number;

  @Column({ name: 'category_id' })
  categoryId: number;

  @Column({ name: 'spec_name', length: 255 })
  specName: string;

  @Column({ name: 'spec_key', length: 100 })
  specKey: string;

  @Column({ name: 'spec_group', length: 100, nullable: true })
  specGroup: string;

  @Column({
    name: 'spec_type',
    type: 'enum',
    enum: ['text', 'number', 'select', 'multiselect', 'textarea'],
    default: 'text',
  })
  specType: string;

  @Column({ name: 'spec_unit', length: 50, nullable: true })
  specUnit: string;

  @Column({
    name: 'spec_options',
    type: 'json',
    nullable: true,
    comment: 'Array of options for select/multiselect',
  })
  specOptions: string[];

  @Column({ length: 255, nullable: true })
  placeholder: string;

  @Column({ name: 'default_value', length: 255, nullable: true })
  defaultValue: string;

  @Column({ name: 'is_required', default: false })
  isRequired: boolean;

  @Column({ name: 'is_filterable', default: false })
  isFilterable: boolean;

  @Column({ name: 'is_variant_option', default: false })
  isVariantOption: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({
    name: 'validation_rules',
    type: 'json',
    nullable: true,
  })
  validationRules: Record<string, any>;

  @Column({ name: 'help_text', type: 'text', nullable: true })
  helpText: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
