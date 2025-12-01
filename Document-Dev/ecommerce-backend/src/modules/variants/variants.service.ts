import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VariantAttribute } from '../../entities/variant-attribute.entity';
import { VariantOption } from '../../entities/variant-option.entity';
import { ProductVariant } from '../../entities/product-variant.entity';
import { ProductVariantOptionValue } from '../../entities/product-variant-option-value.entity';
import { Product } from '../../entities/product.entity';
import { Category } from '../../entities/category.entity';

export class CreateVariantAttributeDto {
    categoryId: number;
    attributeName: string;
    attributeKey: string;
}

export class CreateVariantOptionDto {
    attributeId: number;
    optionValue: string;
    optionLabel?: string;
    colorCode?: string;
    extraPrice?: number;
}

export class CreateProductVariantDto {
    productId: number;
    variantName: string;
    sku?: string;
    price: number;
    compareAtPrice?: number;
    costPrice?: number;
    quantityInStock: number;
    imageUrl?: string;
    attributeValues: { [key: string]: string };
    isDefault?: boolean;
}

@Injectable()
export class VariantsService {
    constructor(
        @InjectRepository(VariantAttribute)
        private attributeRepository: Repository<VariantAttribute>,
        @InjectRepository(VariantOption)
        private optionRepository: Repository<VariantOption>,
        @InjectRepository(ProductVariant)
        private variantRepository: Repository<ProductVariant>,
        @InjectRepository(ProductVariantOptionValue)
        private variantOptionValueRepository: Repository<ProductVariantOptionValue>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) { }

    // Attribute Management
    async createVariantAttribute(
        createVariantAttributeDto: CreateVariantAttributeDto,
    ): Promise<VariantAttribute> {
        const { categoryId, attributeKey } = createVariantAttributeDto;

        // Check unique constraint
        const existing = await this.attributeRepository.findOne({
            where: { categoryId, attributeKey },
        });

        if (existing) {
            throw new BadRequestException(
                'Variant attribute already exists for this category',
            );
        }

        const attribute = this.attributeRepository.create(createVariantAttributeDto);
        return this.attributeRepository.save(attribute);
    }

    async getCategoryVariantAttributes(
        categoryId: number,
    ): Promise<VariantAttribute[]> {
        return this.attributeRepository.find({
            where: { categoryId, isActive: true },
            relations: ['variantOptions'],
            order: { sortOrder: 'ASC' },
        });
    }

    async getVariantAttribute(attributeId: number): Promise<VariantAttribute> {
        const attribute = await this.attributeRepository.findOne({
            where: { attributeId },
            relations: ['variantOptions'],
        });

        if (!attribute) {
            throw new NotFoundException('Variant attribute not found');
        }

        return attribute;
    }

    async deleteVariantAttribute(attributeId: number): Promise<{ message: string }> {
        const attribute = await this.attributeRepository.findOne({
            where: { attributeId },
        });

        if (!attribute) {
            throw new NotFoundException('Variant attribute not found');
        }

        await this.attributeRepository.remove(attribute);
        return { message: 'Variant attribute deleted' };
    }

    // Option Management
    async createVariantOption(
        createVariantOptionDto: CreateVariantOptionDto,
    ): Promise<VariantOption> {
        const { attributeId } = createVariantOptionDto;

        const attribute = await this.attributeRepository.findOne({
            where: { attributeId },
        });

        if (!attribute) {
            throw new NotFoundException('Variant attribute not found');
        }

        const option = this.optionRepository.create(createVariantOptionDto);
        return this.optionRepository.save(option);
    }

    async getVariantOptions(attributeId: number): Promise<VariantOption[]> {
        return this.optionRepository.find({
            where: { attributeId, isActive: true },
            order: { sortOrder: 'ASC' },
        });
    }

    async getVariantOption(optionId: number): Promise<VariantOption> {
        const option = await this.optionRepository.findOne({
            where: { optionId },
        });

        if (!option) {
            throw new NotFoundException('Variant option not found');
        }

        return option;
    }

    async deleteVariantOption(optionId: number): Promise<{ message: string }> {
        const option = await this.optionRepository.findOne({
            where: { optionId },
        });

        if (!option) {
            throw new NotFoundException('Variant option not found');
        }

        await this.optionRepository.remove(option);
        return { message: 'Variant option deleted' };
    }

    // Product Variant Management
    async createProductVariant(
        createProductVariantDto: CreateProductVariantDto,
    ): Promise<ProductVariant> {
        const { productId, attributeValues, sku, ...variantData } =
            createProductVariantDto;

        const product = await this.productRepository.findOne({
            where: { productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Check SKU uniqueness
        if (sku) {
            const existingSku = await this.variantRepository.findOne({
                where: { sku },
            });

            if (existingSku) {
                throw new BadRequestException('SKU already exists');
            }
        }

        const variant = this.variantRepository.create({
            productId,
            sku: sku || `${product.sku}-${Date.now()}`,
            attributeValues,
            ...variantData,
        });

        const savedVariant = await this.variantRepository.save(variant);

        // If there are attribute values, save them
        if (Object.keys(attributeValues).length > 0) {
            for (const [attributeKey, optionValue] of Object.entries(
                attributeValues,
            )) {
                // Find the attribute
                const attribute = await this.attributeRepository.findOne({
                    where: { attributeKey, categoryId: product.categoryId },
                });

                if (attribute) {
                    // Find the option
                    const option = await this.optionRepository.findOne({
                        where: { attributeId: attribute.attributeId, optionValue },
                    });

                    if (option) {
                        await this.variantOptionValueRepository.save({
                            variantId: savedVariant.variantId,
                            attributeId: attribute.attributeId,
                            optionId: option.optionId,
                        });
                    }
                }
            }
        }

        return savedVariant;
    }

    async getProductVariants(productId: number): Promise<ProductVariant[]> {
        return this.variantRepository.find({
            where: { productId, isActive: true },
            relations: ['variantOptionValues', 'variantOptionValues.option'],
            order: { isDefault: 'DESC', createdAt: 'ASC' },
        });
    }

    async getProductVariant(variantId: number): Promise<ProductVariant> {
        const variant = await this.variantRepository.findOne({
            where: { variantId },
            relations: ['variantOptionValues', 'variantOptionValues.option'],
        });

        if (!variant) {
            throw new NotFoundException('Product variant not found');
        }

        return variant;
    }

    async updateProductVariant(
        variantId: number,
        updateData: Partial<CreateProductVariantDto>,
    ): Promise<ProductVariant> {
        const variant = await this.variantRepository.findOne({
            where: { variantId },
        });

        if (!variant) {
            throw new NotFoundException('Product variant not found');
        }

        Object.assign(variant, updateData);
        return this.variantRepository.save(variant);
    }

    async deleteProductVariant(variantId: number): Promise<{ message: string }> {
        const variant = await this.variantRepository.findOne({
            where: { variantId },
        });

        if (!variant) {
            throw new NotFoundException('Product variant not found');
        }

        await this.variantRepository.remove(variant);
        return { message: 'Product variant deleted' };
    }

    async getDefaultVariant(productId: number): Promise<ProductVariant | null> {
        return this.variantRepository.findOne({
            where: { productId, isDefault: true, isActive: true },
        });
    }

    async setDefaultVariant(
        productId: number,
        variantId: number,
    ): Promise<ProductVariant> {
        // Reset all other variants
        await this.variantRepository.update(
            { productId, isDefault: true },
            { isDefault: false },
        );

        // Set the new default
        const variant = await this.variantRepository.findOne({
            where: { variantId, productId },
        });

        if (!variant) {
            throw new NotFoundException('Product variant not found');
        }

        variant.isDefault = true;
        return this.variantRepository.save(variant);
    }

    async getVariantsByAttributes(
        productId: number,
        attributes: { [key: string]: string },
    ): Promise<ProductVariant[]> {
        // Find variants matching specific attributes
        let query = this.variantRepository
            .createQueryBuilder('variant')
            .where('variant.productId = :productId', { productId })
            .andWhere('variant.isActive = true');

        for (const [key, value] of Object.entries(attributes)) {
            query = query.andWhere(
                `JSON_CONTAINS(variant.attributeValues, JSON_OBJECT(:key_${key}, :value_${key}))`,
                {
                    [`key_${key}`]: key,
                    [`value_${key}`]: value,
                },
            );
        }

        return query.getMany();
    }

    async getVariantCombinations(productId: number) {
        const product = await this.productRepository.findOne({
            where: { productId },
            relations: ['category'],
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const attributes = await this.getCategoryVariantAttributes(
            product.categoryId,
        );
        const combinations: { [key: string]: VariantOption[] } = {};

        for (const attribute of attributes) {
            combinations[attribute.attributeKey] =
                await this.getVariantOptions(attribute.attributeId);
        }

        return combinations;
    }
}
