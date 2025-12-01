import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Index,
    ForeignKey,
    OneToMany,
} from 'typeorm';
import { VariantAttribute } from './variant-attribute.entity';
import { ProductVariantOptionValue } from './product-variant-option-value.entity';

@Entity('variant_options')
@Index('idx_attribute_id', ['attributeId'])
export class VariantOption {
    @PrimaryGeneratedColumn({ name: 'option_id' })
    optionId: number;

    @Column({ name: 'attribute_id' })
    @ForeignKey(() => VariantAttribute)
    attributeId: number;

    @Column({ name: 'option_value', length: 100 })
    optionValue: string;

    @Column({ name: 'option_label', length: 100, nullable: true })
    optionLabel: string;

    @Column({ name: 'color_code', length: 20, nullable: true })
    colorCode: string;

    @Column({ name: 'extra_price', type: 'decimal', precision: 15, scale: 2, default: 0 })
    extraPrice: number;

    @Column({ name: 'sort_order', default: 0 })
    sortOrder: number;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => VariantAttribute, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'attribute_id' })
    attribute: VariantAttribute;

    @OneToMany(
        () => ProductVariantOptionValue,
        (value) => value.option,
    )
    variantOptionValues: ProductVariantOptionValue[];
}
