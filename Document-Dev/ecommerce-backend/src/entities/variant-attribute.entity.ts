import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    ForeignKey,
} from 'typeorm';
import { Category } from './category.entity';

@Entity('variant_attributes')
@Index('idx_category_id', ['categoryId'])
export class VariantAttribute {
    @PrimaryGeneratedColumn({ name: 'attribute_id' })
    attributeId: number;

    @Column({ name: 'category_id' })
    @ForeignKey(() => Category)
    categoryId: number;

    @Column({ name: 'attribute_name', length: 100 })
    attributeName: string;

    @Column({ name: 'attribute_key', length: 100 })
    attributeKey: string;

    @Column({ name: 'sort_order', default: 0 })
    sortOrder: number;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => Category, (category) => category.variantAttributes, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'category_id' })
    category: Category;
}
