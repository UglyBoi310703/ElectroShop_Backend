import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    CategorySpecificationTemplate,
} from '../../entities/category-specification-template.entity';
import { ProductSpecification } from '../../entities/product-specification.entity';
import { Product } from '../../entities/product.entity';

export class CreateSpecTemplateDto {
    categoryId: number;
    specName: string;
    specKey: string;
    specGroup?: string;
    specType: 'text' | 'number' | 'select' | 'multiselect' | 'textarea';
    specUnit?: string;
    specOptions?: string[];
    isRequired?: boolean;
    isFilterable?: boolean;
    isVariantOption?: boolean;
    placeholder?: string;
    defaultValue?: string;
    helpText?: string;
}

export class UpdateSpecTemplateDto {
    specName?: string;
    specGroup?: string;
    specType?: string;
    specUnit?: string;
    specOptions?: string[];
    isRequired?: boolean;
    isFilterable?: boolean;
    isVariantOption?: boolean;
}

export class SaveProductSpecDto {
    productId: number;
    templateId: number;
    specKey: string;
    specName: string;
    specValue: string;
    specUnit?: string;
}

@Injectable()
export class SpecificationsService {
    constructor(
        @InjectRepository(CategorySpecificationTemplate)
        private templateRepository: Repository<CategorySpecificationTemplate>,
        @InjectRepository(ProductSpecification)
        private specificationRepository: Repository<ProductSpecification>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) { }

    async createSpecTemplate(
        createSpecTemplateDto: CreateSpecTemplateDto,
    ): Promise<CategorySpecificationTemplate> {
        const { categoryId, specKey } = createSpecTemplateDto;

        // Check unique constraint
        const existing = await this.templateRepository.findOne({
            where: { categoryId, specKey },
        });

        if (existing) {
            throw new BadRequestException(
                'Specification already exists for this category',
            );
        }

        const template = this.templateRepository.create(createSpecTemplateDto);
        return this.templateRepository.save(template);
    }

    async updateSpecTemplate(
        templateId: number,
        updateSpecTemplateDto: UpdateSpecTemplateDto,
    ): Promise<CategorySpecificationTemplate> {
        const template = await this.templateRepository.findOne({
            where: { templateId },
        });

        if (!template) {
            throw new NotFoundException('Specification template not found');
        }

        Object.assign(template, updateSpecTemplateDto);
        return this.templateRepository.save(template);
    }

    async getCategoryTemplates(
        categoryId: number,
    ): Promise<CategorySpecificationTemplate[]> {
        return this.templateRepository.find({
            where: { categoryId },
            order: { sortOrder: 'ASC', specName: 'ASC' },
        });
    }

    async getSpecTemplate(templateId: number): Promise<CategorySpecificationTemplate> {
        const template = await this.templateRepository.findOne({
            where: { templateId },
        });

        if (!template) {
            throw new NotFoundException('Specification template not found');
        }

        return template;
    }

    async deleteSpecTemplate(templateId: number): Promise<{ message: string }> {
        const template = await this.templateRepository.findOne({
            where: { templateId },
        });

        if (!template) {
            throw new NotFoundException('Specification template not found');
        }

        await this.templateRepository.remove(template);
        return { message: 'Specification template deleted' };
    }

    async saveProductSpecifications(
        productId: number,
        specs: SaveProductSpecDto[],
    ): Promise<ProductSpecification[]> {
        const product = await this.productRepository.findOne({
            where: { productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Delete existing specifications for this product
        await this.specificationRepository.delete({ productId });

        const savedSpecs: ProductSpecification[] = [];

        for (const spec of specs) {
            const template = await this.templateRepository.findOne({
                where: { templateId: spec.templateId },
            });

            if (!template) {
                throw new NotFoundException(
                    `Template ${spec.templateId} not found`,
                );
            }

            const specification = this.specificationRepository.create({
                productId,
                templateId: spec.templateId,
                specKey: spec.specKey,
                specName: spec.specName,
                specValue: spec.specValue,
                specValueNormalized: String(spec.specValue).toLowerCase(),
                specUnit: spec.specUnit || template.specUnit,
                specGroup: template.specGroup,
            });

            const saved = await this.specificationRepository.save(specification);
            savedSpecs.push(saved);
        }

        return savedSpecs;
    }

    async getProductSpecifications(
        productId: number,
    ): Promise<ProductSpecification[]> {
        return this.specificationRepository.find({
            where: { productId },
            order: { specGroup: 'ASC', sortOrder: 'ASC' },
        });
    }

    async getSpecificationsByGroup(productId: number) {
        const specs = await this.getProductSpecifications(productId);

        const grouped: { [key: string]: ProductSpecification[] } = {};

        for (const spec of specs) {
            const group = spec.specGroup || 'General';
            if (!grouped[group]) {
                grouped[group] = [];
            }
            grouped[group].push(spec);
        }

        return grouped;
    }

    async getCategoryFilterableSpecs(
        categoryId: number,
    ): Promise<CategorySpecificationTemplate[]> {
        return this.templateRepository.find({
            where: { categoryId, isFilterable: true },
            order: { sortOrder: 'ASC' },
        });
    }

    async getCategoryVariantSpecs(
        categoryId: number,
    ): Promise<CategorySpecificationTemplate[]> {
        return this.templateRepository.find({
            where: { categoryId, isVariantOption: true },
            order: { sortOrder: 'ASC' },
        });
    }

    async getFilterValues(categoryId: number, specKey: string) {
        // Get all unique values for a specific specification
        const specifications = await this.specificationRepository
            .createQueryBuilder('spec')
            .select('DISTINCT spec.specValueNormalized', 'value')
            .innerJoin('spec.product', 'product')
            .where('product.categoryId = :categoryId', { categoryId })
            .andWhere('spec.specKey = :specKey', { specKey })
            .orderBy('spec.specValueNormalized', 'ASC')
            .getRawMany();

        return specifications.map((s) => s.value);
    }

    async searchProductsBySpec(
        categoryId: number,
        filters: { [key: string]: string[] },
    ) {
        let query = this.specificationRepository
            .createQueryBuilder('spec')
            .innerJoin('spec.product', 'product')
            .where('product.categoryId = :categoryId', { categoryId })
            .andWhere('product.isActive = true');

        // Apply filters
        let filterIndex = 0;
        for (const [specKey, values] of Object.entries(filters)) {
            if (values.length > 0) {
                query = query.andWhere(
                    `spec.specKey = :specKey_${filterIndex}`,
                    { [`specKey_${filterIndex}`]: specKey },
                );

                query = query.andWhere(
                    `spec.specValueNormalized IN (:...values_${filterIndex})`,
                    {
                        [`values_${filterIndex}`]: values.map((v) => v.toLowerCase()),
                    },
                );

                filterIndex++;
            }
        }

        const results = await query.distinct(true).getMany();
        return results.map((r) => r.productId);
    }
}
