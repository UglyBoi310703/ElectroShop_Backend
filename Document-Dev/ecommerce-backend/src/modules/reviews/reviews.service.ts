import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../entities/review.entity';
import { Product } from '../../entities/product.entity';

export class CreateReviewDto {
    productId: number;
    variantId?: number;
    orderId?: number;
    rating: number;
    title?: string;
    comment?: string;
    images?: string[];
}

export class UpdateReviewDto {
    rating?: number;
    title?: string;
    comment?: string;
    images?: string[];
}

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) { }

    async createReview(
        userId: number,
        createReviewDto: CreateReviewDto,
    ): Promise<Review> {
        const { productId, rating, variantId, orderId, ...rest } = createReviewDto;

        if (rating < 1 || rating > 5) {
            throw new BadRequestException('Rating must be between 1 and 5');
        }

        const product = await this.productRepository.findOne({
            where: { productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Check if user already reviewed this product
        const existingReview = await this.reviewRepository.findOne({
            where: {
                userId,
                productId,
                variantId: variantId || null,
            },
        });

        if (existingReview) {
            throw new BadRequestException('You already reviewed this product');
        }

        const review = this.reviewRepository.create({
            userId,
            productId,
            variantId: variantId || null,
            orderId: orderId || null,
            rating,
            isVerifiedPurchase: !!orderId,
            ...rest,
        });

        const savedReview = await this.reviewRepository.save(review);

        // Update product rating
        await this.updateProductRating(productId);

        return savedReview;
    }

    async getProductReviews(
        productId: number,
        page: number = 1,
        limit: number = 10,
        approved: boolean = true,
    ) {
        const where: any = { productId };

        if (approved) {
            where.isApproved = true;
        }

        const [reviews, total] = await this.reviewRepository.findAndCount({
            where,
            relations: ['user', 'product', 'variant'],
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });

        return {
            reviews,
            total,
            page,
            limit,
        };
    }

    async getUserReviews(
        userId: number,
        page: number = 1,
        limit: number = 10,
    ) {
        const [reviews, total] = await this.reviewRepository.findAndCount({
            where: { userId },
            relations: ['product', 'variant'],
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });

        return {
            reviews,
            total,
            page,
            limit,
        };
    }

    async getReviewById(reviewId: number): Promise<Review> {
        const review = await this.reviewRepository.findOne({
            where: { reviewId },
            relations: ['user', 'product', 'variant'],
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        return review;
    }

    async updateReview(
        reviewId: number,
        userId: number,
        updateReviewDto: UpdateReviewDto,
    ): Promise<Review> {
        const review = await this.reviewRepository.findOne({
            where: { reviewId },
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        if (review.userId !== userId) {
            throw new ForbiddenException(
                'You can only edit your own reviews',
            );
        }

        if (updateReviewDto.rating) {
            if (updateReviewDto.rating < 1 || updateReviewDto.rating > 5) {
                throw new BadRequestException('Rating must be between 1 and 5');
            }
        }

        Object.assign(review, updateReviewDto);
        const updatedReview = await this.reviewRepository.save(review);

        // Update product rating
        await this.updateProductRating(review.productId);

        return updatedReview;
    }

    async deleteReview(reviewId: number, userId: number): Promise<{ message: string }> {
        const review = await this.reviewRepository.findOne({
            where: { reviewId },
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        if (review.userId !== userId) {
            throw new ForbiddenException(
                'You can only delete your own reviews',
            );
        }

        await this.reviewRepository.remove(review);

        // Update product rating
        await this.updateProductRating(review.productId);

        return { message: 'Review deleted successfully' };
    }

    async approveReview(reviewId: number): Promise<Review> {
        const review = await this.reviewRepository.findOne({
            where: { reviewId },
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        review.isApproved = true;
        const updatedReview = await this.reviewRepository.save(review);

        // Update product rating
        await this.updateProductRating(review.productId);

        return updatedReview;
    }

    async rejectReview(reviewId: number): Promise<{ message: string }> {
        const review = await this.reviewRepository.findOne({
            where: { reviewId },
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        await this.reviewRepository.remove(review);

        // Update product rating
        await this.updateProductRating(review.productId);

        return { message: 'Review rejected' };
    }

    private async updateProductRating(productId: number): Promise<void> {
        const reviews = await this.reviewRepository.find({
            where: { productId, isApproved: true },
        });

        if (reviews.length === 0) {
            await this.productRepository.update(productId, {
                ratingAverage: 0,
                ratingCount: 0,
            });
            return;
        }

        const average =
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

        await this.productRepository.update(productId, {
            ratingAverage: Math.round(average * 10) / 10,
            ratingCount: reviews.length,
        });
    }

    async getProductRatingSummary(productId: number) {
        const product = await this.productRepository.findOne({
            where: { productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const reviews = await this.reviewRepository.find({
            where: { productId, isApproved: true },
        });

        const summary = {
            average: product.ratingAverage,
            count: product.ratingCount,
            distribution: {
                5: 0,
                4: 0,
                3: 0,
                2: 0,
                1: 0,
            },
        };

        for (const review of reviews) {
            summary.distribution[review.rating]++;
        }

        return summary;
    }

    async markReviewHelpful(reviewId: number): Promise<Review> {
        const review = await this.reviewRepository.findOne({
            where: { reviewId },
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        review.helpfulCount = (review.helpfulCount || 0) + 1;
        return this.reviewRepository.save(review);
    }
}
