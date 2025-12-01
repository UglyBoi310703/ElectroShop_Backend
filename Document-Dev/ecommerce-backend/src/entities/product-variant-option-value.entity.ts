import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Index,
    ForeignKey,
} from 'typeorm';
import { ProductVariant } from './product-variant.entity';
import { VariantAttribute } from './variant-attribute.entity';
import { VariantOption } from './variant-option.entity';

@Entity('product_variant_option_values')
@Index('idx_variant_id', ['variantId'])
@Index('idx_attribute_id', ['attributeId'])
@Index('idx_option_id', ['optionId'])
export class ProductVariantOptionValue {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'variant_id' })
    @ForeignKey(() => ProductVariant)
    variantId: number;

    @Column({ name: 'attribute_id' })
    @ForeignKey(() => VariantAttribute)
    attributeId: number;

    @Column({ name: 'option_id' })
    @ForeignKey(() => VariantOption)
    optionId: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => ProductVariant, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'variant_id' })
    variant: ProductVariant;

    @ManyToOne(() => VariantAttribute, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'attribute_id' })
    attribute: VariantAttribute;

    @ManyToOne(() => VariantOption, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'option_id' })
    option: VariantOption;
}
