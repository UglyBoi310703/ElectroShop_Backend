import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Between, In, Brackets } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { ProductImage } from '../../entities/product-image.entity';
import { ProductSpecification } from '../../entities/product-specification.entity';
import { ProductVariant } from '../../entities/product-variant.entity';
import { Review } from '../../entities/review.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(ProductImage)
        private productImageRepository: Repository<ProductImage>,
        @InjectRepository(ProductSpecification)
        private specificationRepository: Repository<ProductSpecification>,
        @InjectRepository(ProductVariant)
        private variantRepository: Repository<ProductVariant>,
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,
    ) { }

    async createProduct(
        sellerId: number,
        createProductDto: CreateProductDto,
    ): Promise<Product> {
        const {
            categoryId,
            brandId,
            productName,
            slug,
            sku,
            basePrice,
            hasVariants,
            quantityInStock,
            ...rest
        } = createProductDto;

        // Check if product with slug exists
        const existingProduct = await this.productRepository.findOne({
            where: { slug },
        });

        if (existingProduct) {
            throw new BadRequestException('Product slug already exists');
        }

        const product = this.productRepository.create({
            sellerId,
            categoryId,
            brandId,
            productName,
            slug,
            sku,
            basePrice,
            hasVariants,
            quantityInStock: hasVariants ? 0 : quantityInStock,
            ...rest,
            status: 'draft' as any,
        } as any);

        return this.productRepository.save(product as any) as Promise<Product>;
    }

    async updateProduct(
        productId: number,
        updateProductDto: UpdateProductDto,
    ): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        Object.assign(product, updateProductDto);
        return this.productRepository.save(product);
    }

    async getProductById(productId: number): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { productId },
            relations: [
                'category',
                'brand',
                'images',
                'specifications',
                'variants',
                'reviews',
            ],
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Increase view count
        product.viewCount = (product.viewCount || 0) + 1;
        await this.productRepository.save(product);

        return product;
    }

    async getProductBySlug(slug: string): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { slug, isActive: true },
            relations: [
                'category',
                'brand',
                'images',
                'specifications',
                'variants',
                'reviews',
            ],
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Increase view count
        product.viewCount = (product.viewCount || 0) + 1;
        await this.productRepository.save(product);

        return product;
    }

    async getProducts(
        filterProductDto: FilterProductDto,
    ): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
        const {
            categoryId,
            brandId,
            minPrice,
            maxPrice,
            search,
            page = 1,
            limit = 20,
            sortBy = 'createdAt',
        } = filterProductDto;

        const query = this.productRepository
            .createQueryBuilder('product')
            .where('product.isActive = :isActive', { isActive: true })
            .andWhere('product.status = :status', { status: 'active' });

        if (categoryId) {
            query.andWhere('product.categoryId = :categoryId', { categoryId });
        }

        if (brandId) {
            query.andWhere('product.brandId = :brandId', { brandId });
        }

        if (minPrice || maxPrice) {
            query.andWhere(
                new Brackets((qb) => {
                    if (minPrice) {
                        qb.andWhere('product.basePrice >= :minPrice', { minPrice });
                    }
                    if (maxPrice) {
                        qb.andWhere('product.basePrice <= :maxPrice', { maxPrice });
                    }
                }),
            );
        }

        if (search) {
            query.andWhere(
                new Brackets((qb) => {
                    qb.orWhere('product.productName LIKE :search', { search: `%${search}%` })
                        .orWhere('product.shortDescription LIKE :search', {
                            search: `%${search}%`,
                        });
                }),
            );
        }

        // Sorting
        switch (sortBy) {
            case 'price-asc':
            case 'price' as any:
                query.orderBy('product.basePrice', 'ASC');
                break;
            case 'price-desc':
                query.orderBy('product.basePrice', 'DESC');
                break;
            case 'rating':
                query.orderBy('product.ratingAverage', 'DESC');
                break;
            case 'popular' as any:
                query.orderBy('product.viewCount', 'DESC');
                break;
            case 'newest':
                query.orderBy('product.createdAt', 'DESC');
                break;
            default:
                query.orderBy('product.createdAt', 'DESC');
        }

        // Pagination
        const skip = (page - 1) * limit;
        query.skip(skip).take(limit);

        query.leftJoinAndSelect('product.images', 'images', 'images.isPrimary = true');
        query.leftJoinAndSelect('product.category', 'category');
        query.leftJoinAndSelect('product.brand', 'brand');

        const [data, total] = await query.getManyAndCount();

        return {
            data,
            total,
            page,
            limit,
        };
    }

    async deleteProduct(productId: number): Promise<{ message: string }> {
        const product = await this.productRepository.findOne({
            where: { productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        await this.productRepository.remove(product);
        return { message: 'Product deleted successfully' };
    }

    async addProductImage(
        productId: number,
        imageUrl: string,
        isPrimary: boolean = false,
    ): Promise<ProductImage> {
        const product = await this.productRepository.findOne({
            where: { productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (isPrimary) {
            await this.productImageRepository.update(
                { productId },
                { isPrimary: false },
            );
        }

        const image = this.productImageRepository.create({
            productId,
            imageUrl,
            isPrimary,
        });

        return this.productImageRepository.save(image);
    }

    async getProductImages(productId: number): Promise<ProductImage[]> {
        return this.productImageRepository.find({
            where: { productId },
            order: { sortOrder: 'ASC', isPrimary: 'DESC' },
        });
    }

    async updateProductStatus(
        productId: number,
        status: string,
    ): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        product.status = status as any;
        return this.productRepository.save(product);
    }

    async publishProduct(productId: number): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        product.status = 'active';
        product.isActive = true;
        return this.productRepository.save(product);
    }

    async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
        return this.productRepository.find({
            where: { isFeatured: true, isActive: true, status: 'active' },
            relations: ['images', 'category', 'brand'],
            take: limit,
            order: { createdAt: 'DESC' },
        });
    }

    async searchProducts(keyword: string, limit: number = 10): Promise<Product[]> {
        return this.productRepository
            .createQueryBuilder('product')
            .where('product.isActive = :isActive', { isActive: true })
            .andWhere('product.status = :status', { status: 'active' })
            .andWhere(
                new Brackets((qb) => {
                    qb.orWhere('MATCH(product.productName) AGAINST(:keyword IN BOOLEAN MODE)', {
                        keyword: `*${keyword}*`,
                    }).orWhere('product.productName LIKE :search', { search: `%${keyword}%` });
                }),
            )
            .leftJoinAndSelect('product.images', 'images', 'images.isPrimary = true')
            .orderBy('product.productName', 'ASC')
            .take(limit)
            .getMany();
    }
}
