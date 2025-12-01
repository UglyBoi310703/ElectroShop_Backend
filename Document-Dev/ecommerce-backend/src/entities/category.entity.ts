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

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn({ name: 'category_id' })
  categoryId: number;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @Column({ name: 'category_name', length: 255 })
  categoryName: string;

  @Column({ unique: true, length: 255 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'image_url', length: 500, nullable: true })
  imageUrl: string;

  @Column({ name: 'icon_url', length: 500, nullable: true })
  iconUrl: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Self-referencing relationship
  @ManyToOne(() => Category, category => category.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @OneToMany(() => Category, category => category.parent)
  children: Category[];

  // Relations will be added later
  // @OneToMany(() => Product, product => product.category)
  // products: Product[];

  // @OneToMany(() => CategorySpecificationTemplate, template => template.category)
  // specificationTemplates: CategorySpecificationTemplate[];
}
