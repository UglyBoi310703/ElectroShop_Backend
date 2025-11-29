import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from '../categories/entities/category.entity';
import { FilterProductsDto } from './dto/filter-products.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(dto: CreateProductDto) {
    const category = await this.categoryRepository.findOne({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const { images, categoryId, ...productData } = dto;
    const product = this.productRepository.create({
      ...productData,
      category,
      images: images?.map((url) => this.productImageRepository.create({ url })),
    });
    return this.productRepository.save(product);
  }

  async findAll(
    filter: FilterProductsDto = new FilterProductsDto(),
    pagination: PaginationQueryDto = new PaginationQueryDto(),
  ) {
    const { page = 1, limit = 20 } = pagination;
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images');

    if (filter.keyword) {
      query.andWhere('product.name LIKE :keyword', {
        keyword: `%${filter.keyword}%`,
      });
    }
    if (filter.categoryId) {
      query.andWhere('category.id = :categoryId', {
        categoryId: filter.categoryId,
      });
    }
    if (filter.minPrice !== undefined) {
      query.andWhere('product.price >= :minPrice', { minPrice: filter.minPrice });
    }
    if (filter.maxPrice !== undefined) {
      query.andWhere('product.price <= :maxPrice', { maxPrice: filter.maxPrice });
    }

    query.skip((page - 1) * limit).take(limit);

    const [items, total] = await query.getManyAndCount();
    return {
      items,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'images', 'reviews'],
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    if (dto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      product.category = category;
    }
    if (dto.images) {
      product.images = dto.images.map((url) =>
        this.productImageRepository.create({ url }),
      );
    }
    const { images, categoryId, ...rest } = dto;
    Object.assign(product, rest);
    return this.productRepository.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    return this.productRepository.remove(product);
  }

  async search(keyword: string) {
    return this.productRepository.find({
      where: { name: Like(`%${keyword}%`) },
      relations: ['category', 'images'],
    });
  }

  async decreaseInventory(productId: string, quantity: number) {
    const product = await this.findOne(productId);
    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient inventory');
    }
    product.stock -= quantity;
    await this.productRepository.save(product);
    return product;
  }
}
