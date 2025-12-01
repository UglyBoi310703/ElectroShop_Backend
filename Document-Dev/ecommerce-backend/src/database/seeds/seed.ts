import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Category } from '../../entities/category.entity';
import { Brand } from '../../entities/brand.entity';
import { Product } from '../../entities/product.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
    const app = await NestFactory.create(AppModule);

    const userRepo = app.get(getRepositoryToken(User));
    const categoryRepo = app.get(getRepositoryToken(Category));
    const brandRepo = app.get(getRepositoryToken(Brand));
    const productRepo = app.get(getRepositoryToken(Product));

    try {
        console.log('🌱 Starting database seed...');

        // Create admin users
        console.log('👤 Creating admin users...');
        const adminPassword = await bcrypt.hash('admin123', 10);

        const admin = userRepo.create({
            email: 'admin@ecommerce.com',
            password: adminPassword,
            fullName: 'Admin User',
            userType: 'admin',
            isVerified: true,
            isActive: true,
        });

        await userRepo.save(admin);
        console.log('✅ Admin user created');

        // Create categories
        console.log('📂 Creating categories...');
        const categories = [
            {
                categoryName: 'Điện thoại',
                slug: 'dien-thoai',
                description: 'Các loại điện thoại thông minh',
            },
            {
                categoryName: 'Laptop',
                slug: 'laptop',
                description: 'Máy tính xách tay',
            },
            {
                categoryName: 'Máy tính bảng',
                slug: 'may-tinh-bang',
                description: 'Tablet',
            },
            {
                categoryName: 'Phụ kiện',
                slug: 'phu-kien',
                description: 'Phụ kiện điện tử',
            },
            {
                categoryName: 'Tai nghe',
                slug: 'tai-nghe',
                description: 'Tai nghe và loa',
            },
        ];

        const savedCategories: Category[] = [];
        for (const cat of categories) {
            const category = categoryRepo.create(cat);
            const saved = await categoryRepo.save(category);
            savedCategories.push(saved);
        }
        console.log(`✅ ${savedCategories.length} categories created`);

        // Create brands
        console.log('🏢 Creating brands...');
        const brands = [
            {
                brandName: 'Apple',
                slug: 'apple',
                description: 'Apple Inc.',
            },
            {
                brandName: 'Samsung',
                slug: 'samsung',
                description: 'Samsung Electronics',
            },
            {
                brandName: 'Intel',
                slug: 'intel',
                description: 'Intel Corporation',
            },
            {
                brandName: 'Lenovo',
                slug: 'lenovo',
                description: 'Lenovo Group',
            },
            {
                brandName: 'Sony',
                slug: 'sony',
                description: 'Sony Corporation',
            },
        ];

        const savedBrands: Brand[] = [];
        for (const brand of brands) {
            const savedBrand = brandRepo.create(brand);
            const saved = await brandRepo.save(savedBrand);
            savedBrands.push(saved);
        }
        console.log(`✅ ${savedBrands.length} brands created`);

        // Create sample products
        console.log('📱 Creating sample products...');
        const products = [
            {
                sellerId: admin.userId,
                categoryId: savedCategories[0].categoryId,
                brandId: savedBrands[0].brandId,
                productName: 'iPhone 15 Pro Max',
                slug: 'iphone-15-pro-max',
                sku: 'IPHONE15PM',
                basePrice: 33990000,
                shortDescription: 'Flagship smartphone từ Apple',
                fullDescription:
                    'iPhone 15 Pro Max với chip A17 Pro, camera advanced, và thiết kế titanium',
                quantityInStock: 50,
                status: 'active',
                isActive: true,
                weight: 0.22,
                warrantyPeriod: 12,
            },
            {
                sellerId: admin.userId,
                categoryId: savedCategories[0].categoryId,
                brandId: savedBrands[1].brandId,
                productName: 'Samsung Galaxy S24 Ultra',
                slug: 'samsung-galaxy-s24-ultra',
                sku: 'SGS24U',
                basePrice: 29990000,
                shortDescription: 'Flagship Samsung terbaru',
                fullDescription: 'Samsung Galaxy S24 Ultra với chip Snapdragon 8 Gen 3',
                quantityInStock: 40,
                status: 'active',
                isActive: true,
                warrantyPeriod: 12,
            },
            {
                sellerId: admin.userId,
                categoryId: savedCategories[1].categoryId,
                brandId: savedBrands[2].brandId,
                productName: 'MacBook Pro 16"',
                slug: 'macbook-pro-16',
                sku: 'MBP16',
                basePrice: 45990000,
                shortDescription: 'Laptop khủng long từ Apple',
                fullDescription:
                    'MacBook Pro 16 inch với chip M3 Pro Max, 36GB RAM, 512GB SSD',
                quantityInStock: 20,
                status: 'active',
                isActive: true,
                warrantyPeriod: 12,
            },
        ];

        const savedProducts: Product[] = [];
        for (const product of products) {
            const savedProduct = productRepo.create(product);
            const saved = await productRepo.save(savedProduct);
            savedProducts.push(saved);
        }
        console.log(`✅ ${savedProducts.length} products created`);

        console.log('✨ Database seed completed successfully!');
        console.log('📊 Summary:');
        console.log(`  - Admin users: 1`);
        console.log(`  - Categories: ${savedCategories.length}`);
        console.log(`  - Brands: ${savedBrands.length}`);
        console.log(`  - Products: ${savedProducts.length}`);
    } catch (error) {
        console.error('❌ Seed error:', error);
    } finally {
        await app.close();
    }
}

seed();
