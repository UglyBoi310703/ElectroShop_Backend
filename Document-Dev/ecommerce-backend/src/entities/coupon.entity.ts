import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

@Entity('coupons')
@Index('idx_coupon_code', ['couponCode'])
@Index('idx_is_active', ['isActive'])
@Index('idx_dates', ['startDate', 'endDate'])
export class Coupon {
    @PrimaryGeneratedColumn({ name: 'coupon_id' })
    couponId: number;

    @Column({ name: 'coupon_code', length: 50, unique: true })
    couponCode: string;

    @Column({ length: 500, nullable: true })
    description: string;

    @Column({
        name: 'discount_type',
        type: 'enum',
        enum: ['percentage', 'fixed_amount', 'free_shipping'],
    })
    discountType: string;

    @Column({ name: 'discount_value', type: 'decimal', precision: 15, scale: 2 })
    discountValue: number;

    @Column({
        name: 'min_order_value',
        type: 'decimal',
        precision: 15,
        scale: 2,
        default: 0,
    })
    minOrderValue: number;

    @Column({
        name: 'max_discount_amount',
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: true,
    })
    maxDiscountAmount: number;

    @Column({ name: 'usage_limit', nullable: true })
    usageLimit: number;

    @Column({ name: 'used_count', default: 0 })
    usedCount: number;

    @Column({ name: 'usage_limit_per_user', default: 1 })
    usageLimitPerUser: number;

    @Column({ name: 'start_date', type: 'timestamp' })
    startDate: Date;

    @Column({ name: 'end_date', type: 'timestamp' })
    endDate: Date;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @Column({ name: 'applicable_categories', type: 'json', nullable: true })
    applicableCategories: any;

    @Column({ name: 'applicable_products', type: 'json', nullable: true })
    applicableProducts: any;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
