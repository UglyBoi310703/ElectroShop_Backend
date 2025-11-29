import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../products/products.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly ordersService: OrdersService,
    private readonly productsService: ProductsService,
  ) {}

  async create(userId: string, dto: CreateReviewDto) {
    const orders = await this.ordersService.findByUser(userId);
    const hasPurchased = orders.some((order) =>
      order.items?.some((item) => item.product.id === dto.productId),
    );
    if (!hasPurchased) {
      throw new ForbiddenException('Purchase required before reviewing');
    }
    const product = await this.productsService.findOne(dto.productId);
    const review = this.reviewRepository.create({
      ...dto,
      user: { id: userId } as any,
      product,
      approved: false,
    });
    return this.reviewRepository.save(review);
  }

  findAll() {
    return this.reviewRepository.find({
      relations: ['user', 'product'],
      order: { createdAt: 'DESC' },
    });
  }

  findByProduct(productId: string) {
    return this.reviewRepository.find({
      where: { product: { id: productId }, approved: true },
      relations: ['user'],
    });
  }

  async update(userId: string, reviewId: string, dto: UpdateReviewDto, role?: UserRole) {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['user'],
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    if (role !== UserRole.ADMIN && review.user.id !== userId) {
      throw new ForbiddenException();
    }
    Object.assign(review, dto);
    review.approved = false;
    return this.reviewRepository.save(review);
  }

  async approve(reviewId: string) {
    const review = await this.reviewRepository.findOne({ where: { id: reviewId } });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    review.approved = true;
    return this.reviewRepository.save(review);
  }

  async remove(reviewId: string) {
    const review = await this.reviewRepository.findOne({ where: { id: reviewId } });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return this.reviewRepository.remove(review);
  }
}
