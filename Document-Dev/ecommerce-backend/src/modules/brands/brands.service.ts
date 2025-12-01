import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '../../entities/brand.entity';

export class CreateBrandDto {
    brandName: string;
    slug: string;
    logoUrl?: string;
    description?: string;
    website?: string;
    country?: string;
}

export class UpdateBrandDto {
    brandName?: string;
    slug?: string;
    logoUrl?: string;
    description?: string;
    website?: string;
    country?: string;
    isActive?: boolean;
}

@Injectable()
export class BrandsService {
    constructor(
        @InjectRepository(Brand)
        private brandRepository: Repository<Brand>,
    ) { }

    async createBrand(createBrandDto: CreateBrandDto): Promise<Brand> {
        const { slug } = createBrandDto;

        const existingBrand = await this.brandRepository.findOne({
            where: { slug },
        });

        if (existingBrand) {
            throw new BadRequestException('Brand slug already exists');
        }

        const brand = this.brandRepository.create(createBrandDto);
        return this.brandRepository.save(brand);
    }

    async updateBrand(
        brandId: number,
        updateBrandDto: UpdateBrandDto,
    ): Promise<Brand> {
        const brand = await this.brandRepository.findOne({
            where: { brandId },
        });

        if (!brand) {
            throw new NotFoundException('Brand not found');
        }

        if (updateBrandDto.slug && updateBrandDto.slug !== brand.slug) {
            const existingBrand = await this.brandRepository.findOne({
                where: { slug: updateBrandDto.slug },
            });

            if (existingBrand) {
                throw new BadRequestException('Brand slug already exists');
            }
        }

        Object.assign(brand, updateBrandDto);
        return this.brandRepository.save(brand);
    }

    async getBrandById(brandId: number): Promise<Brand> {
        const brand = await this.brandRepository.findOne({
            where: { brandId },
        });

        if (!brand) {
            throw new NotFoundException('Brand not found');
        }

        return brand;
    }

    async getBrandBySlug(slug: string): Promise<Brand> {
        const brand = await this.brandRepository.findOne({
            where: { slug, isActive: true },
        });

        if (!brand) {
            throw new NotFoundException('Brand not found');
        }

        return brand;
    }

    async getAllBrands(): Promise<Brand[]> {
        return this.brandRepository.find({
            where: { isActive: true },
            order: { brandName: 'ASC' },
        });
    }

    async deleteBrand(brandId: number): Promise<{ message: string }> {
        const brand = await this.brandRepository.findOne({
            where: { brandId },
        });

        if (!brand) {
            throw new NotFoundException('Brand not found');
        }

        await this.brandRepository.remove(brand);
        return { message: 'Brand deleted successfully' };
    }
}
