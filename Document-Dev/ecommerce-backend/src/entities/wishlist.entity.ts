import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Index,
    ForeignKey,
    Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';

@Entity('wishlists')
@Index('idx_user_id', ['userId'])
@Unique('unique_wishlist', ['userId', 'productId', 'variantId'])
export class Wishlist {
    @PrimaryGeneratedColumn({ name: 'wishlist_id' })
    wishlistId: number;

    @Column({ name: 'user_id' })
    @ForeignKey(() => User)
    userId: number;

    @Column({ name: 'product_id' })
    @ForeignKey(() => Product)
    productId: number;

    @Column({ name: 'variant_id', nullable: true })
    @ForeignKey(() => ProductVariant)
    variantId: number;

    @CreateDateColumn({ name: 'added_at' })
    addedAt: Date;

    @ManyToOne(() => User, (user) => user.wishlists, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Product, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => ProductVariant, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'variant_id' })
    variant: ProductVariant;
}
