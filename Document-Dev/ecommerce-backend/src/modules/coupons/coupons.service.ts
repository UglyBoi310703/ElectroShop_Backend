import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from '../../entities/coupon.entity';

export class CreateCouponDto {
    couponCode: string;
    description?: string;
    discountType: 'percentage' | 'fixed_amount' | 'free_shipping';
    discountValue: number;
    minOrderValue?: number;
    maxDiscountAmount?: number;
    usageLimit?: number;
    usageLimitPerUser?: number;
    startDate: Date;
    endDate: Date;
    applicableCategories?: number[];
    applicableProducts?: number[];
}

export class ValidateCouponDto {
    couponCode: string;
    orderTotal: number;
    userId?: number;
}

@Injectable()
export class CouponsService {
    constructor(
        @InjectRepository(Coupon)
        private couponRepository: Repository<Coupon>,
    ) { }

    async createCoupon(createCouponDto: CreateCouponDto): Promise<Coupon> {
        const { couponCode } = createCouponDto;

        // Check if coupon code exists
        const existing = await this.couponRepository.findOne({
            where: { couponCode },
        });

        if (existing) {
            throw new BadRequestException('Coupon code already exists');
        }

        const coupon = this.couponRepository.create(createCouponDto);
        return this.couponRepository.save(coupon);
    }

    async updateCoupon(
        couponId: number,
        updateData: Partial<CreateCouponDto>,
    ): Promise<Coupon> {
        const coupon = await this.couponRepository.findOne({
            where: { couponId },
        });

        if (!coupon) {
            throw new NotFoundException('Coupon not found');
        }

        Object.assign(coupon, updateData);
        return this.couponRepository.save(coupon);
    }

    async getCouponById(couponId: number): Promise<Coupon> {
        const coupon = await this.couponRepository.findOne({
            where: { couponId },
        });

        if (!coupon) {
            throw new NotFoundException('Coupon not found');
        }

        return coupon;
    }

    async getCouponByCode(couponCode: string): Promise<Coupon> {
        const coupon = await this.couponRepository.findOne({
            where: { couponCode },
        });

        if (!coupon) {
            throw new NotFoundException('Coupon not found');
        }

        return coupon;
    }

    async getAllCoupons(active: boolean = true) {
        const where: any = {};

        if (active) {
            where.isActive = true;
        }

        return this.couponRepository.find({
            where,
            order: { createdAt: 'DESC' },
        });
    }

    async deleteCoupon(couponId: number): Promise<{ message: string }> {
        const coupon = await this.couponRepository.findOne({
            where: { couponId },
        });

        if (!coupon) {
            throw new NotFoundException('Coupon not found');
        }

        await this.couponRepository.remove(coupon);
        return { message: 'Coupon deleted' };
    }

    async validateCoupon(validateCouponDto: ValidateCouponDto) {
        const { couponCode, orderTotal } = validateCouponDto;

        const coupon = await this.couponRepository.findOne({
            where: { couponCode },
        });

        if (!coupon) {
            throw new NotFoundException('Coupon not found');
        }

        // Check if active
        if (!coupon.isActive) {
            throw new BadRequestException('Coupon is not active');
        }

        // Check date validity
        const now = new Date();
        if (now < coupon.startDate || now > coupon.endDate) {
            throw new BadRequestException('Coupon has expired or not yet valid');
        }

        // Check usage limit
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            throw new BadRequestException('Coupon usage limit exceeded');
        }

        // Check minimum order value
        if (coupon.minOrderValue && orderTotal < coupon.minOrderValue) {
            throw new BadRequestException(
                `Minimum order value is ${coupon.minOrderValue}`,
            );
        }

        // Calculate discount
        let discount = 0;

        if (coupon.discountType === 'percentage') {
            discount = (orderTotal * coupon.discountValue) / 100;
            if (coupon.maxDiscountAmount) {
                discount = Math.min(discount, coupon.maxDiscountAmount);
            }
        } else if (coupon.discountType === 'fixed_amount') {
            discount = coupon.discountValue;
        } else if (coupon.discountType === 'free_shipping') {
            discount = 30000; // Fixed shipping cost
        }

        return {
            isValid: true,
            coupon,
            discount: Math.round(discount),
            finalTotal: Math.round(orderTotal - discount),
        };
    }

    async applyCoupon(
        couponCode: string,
        userId?: number,
    ): Promise<{ message: string; discount: number }> {
        const coupon = await this.couponRepository.findOne({
            where: { couponCode },
        });

        if (!coupon) {
            throw new NotFoundException('Coupon not found');
        }

        // Increment used count
        coupon.usedCount += 1;
        await this.couponRepository.save(coupon);

        return {
            message: 'Coupon applied successfully',
            discount:
                coupon.discountType === 'percentage'
                    ? coupon.discountValue
                    : coupon.discountValue,
        };
    }

    async getAvailableCoupons() {
        const now = new Date();

        return this.couponRepository.find({
            where: {
                isActive: true,
            },
        });
    }

    async checkCouponUsage(couponCode: string, userId: number): Promise<number> {
        const coupon = await this.couponRepository.findOne({
            where: { couponCode },
        });

        if (!coupon) {
            throw new NotFoundException('Coupon not found');
        }

        // This would need additional tracking in a coupon_usage table
        // For now, just return usage limit per user
        return coupon.usageLimitPerUser || 1;
    }

    async expireCoupon(couponId: number): Promise<Coupon> {
        const coupon = await this.couponRepository.findOne({
            where: { couponId },
        });

        if (!coupon) {
            throw new NotFoundException('Coupon not found');
        }

        coupon.endDate = new Date();
        coupon.isActive = false;
        return this.couponRepository.save(coupon);
    }
}
