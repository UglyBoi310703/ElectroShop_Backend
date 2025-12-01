# 🔧 HƯỚNG DẪN BỔ SUNG CODE CHO CÁC MODULES

## ⚠️ LÝ DO CHỈ CÓ MODULE PRODUCTS

Backend hiện tại đã có:
- ✅ **Auth Module** - Hoàn chỉnh (Register, Login, JWT)
- ✅ **Products Module** - Hoàn chỉnh (với Variants & Specs)
- ✅ **Common** - Guards, Decorators, Strategies
- ✅ **Entities** - Database models

Các modules còn lại (Users, Categories, Cart, Orders...) có **cấu trúc thư mục** nhưng **code chưa đầy đủ** vì:
1. Mỗi module cần 5-10 files (controller, service, DTOs...)
2. Tổng cộng cần ~100+ files
3. Bạn có thể tự generate dựa trên mẫu Products

---

## 🚀 3 CÁCH XỬ LÝ

### Option 1: Sử dụng NestJS CLI (Khuyên dùng - Nhanh nhất)

```bash
cd ecommerce-backend

# Generate Users module
nest g module modules/users
nest g controller modules/users
nest g service modules/users

# Generate Categories module  
nest g module modules/categories
nest g controller modules/categories
nest g service modules/categories

# Generate Cart module
nest g module modules/cart
nest g controller modules/cart
nest g service modules/cart

# Generate Orders module
nest g module modules/orders
nest g controller modules/orders
nest g service modules/orders

# Tương tự cho các modules khác...
```

**Sau đó copy code từ Products module và chỉnh sửa**

### Option 2: Copy & Modify từ Products Module

```bash
# Copy Products module làm template
cp -r src/modules/products src/modules/categories

# Sau đó mở và find/replace:
# "Product" → "Category"
# "product" → "category"
# Điều chỉnh logic theo nhu cầu
```

### Option 3: Dùng Code Tôi Cung Cấp (Cơ bản)

Tôi đã tạo cấu trúc cơ bản cho tất cả modules. Chỉ cần thêm logic:

---

## 📋 MODULES CẦN BỔ SUNG

### 1. Users Module
**Chức năng:**
- Get user profile
- Update user profile
- Manage addresses
- Change password

**Files cần tạo:**
```
users/
├── users.module.ts       ✅ Đã có
├── users.controller.ts   → Cần thêm endpoints
├── users.service.ts      → Cần thêm logic
└── dto/
    ├── update-user.dto.ts
    ├── create-address.dto.ts
    └── change-password.dto.ts
```

**Endpoints:**
```typescript
GET    /users/:id          // Get user by ID
PUT    /users/:id          // Update user
GET    /users/:id/addresses  // Get addresses
POST   /users/:id/addresses  // Add address
PUT    /users/:id/password   // Change password
```

### 2. Categories Module
**Files cần:**
```
categories/
├── categories.module.ts
├── categories.controller.ts
├── categories.service.ts
└── dto/
    ├── create-category.dto.ts
    └── update-category.dto.ts
```

**Endpoints:**
```typescript
GET    /categories         // Get all with tree structure
GET    /categories/:id     // Get category
POST   /categories         // Create (Admin)
PUT    /categories/:id     // Update (Admin)
DELETE /categories/:id     // Delete (Admin)
```

### 3. Brands Module
Tương tự Categories

### 4. Specifications Module  
**Chức năng:**
- Manage spec templates
- Get templates by category
- Save product specs

### 5. Variants Module
**Chức năng:**
- Manage variant attributes
- Manage variant options
- Create product variants

### 6. Cart Module
**Chức năng:**
- View cart
- Add/remove items
- Update quantity
- Calculate totals

### 7. Orders Module  
**Chức năng:**
- Create order (checkout)
- View orders
- Update order status
- Track order

### 8. Reviews Module
**Chức năng:**
- Create review
- Get product reviews
- Update/delete own review
- Approve reviews (Admin)

### 9. Coupons Module
**Chức năng:**
- Create coupon (Admin)
- Validate coupon
- Apply coupon to order

### 10. Upload Module
**Chức năng:**
- Upload product images
- Upload user avatar
- Delete files

---

## 💡 MẪU CODE ĐẦY ĐỦ CHO 1 MODULE

### Ví dụ: Categories Module Hoàn Chỉnh

#### categories.module.ts
\`\`\`typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from '../../entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
\`\`\`

#### categories.controller.ts
\`\`\`typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  update(@Param('id') id: number, @Body() updateCategoryDto: any) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  remove(@Param('id') id: number) {
    return this.categoriesService.remove(id);
  }
}
\`\`\`

#### categories.service.ts
\`\`\`typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll() {
    return this.categoryRepository.find({
      where: { isActive: true },
      relations: ['children', 'parent'],
      order: { sortOrder: 'ASC' },
    });
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { categoryId: id },
      relations: ['children', 'parent'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async update(id: number, updateCategoryDto: any) {
    const category = await this.findOne(id);
    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
    return { message: 'Category deleted successfully' };
  }
}
\`\`\`

#### dto/create-category.dto.ts
\`\`\`typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  categoryName: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  parentId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
\`\`\`

---

## 🎯 LỘ TRÌNH PHÁT TRIỂN

### Phase 1: Core Modules (Ưu tiên cao)
1. ✅ Auth - Đã xong
2. ✅ Products - Đã xong  
3. ⚠️ Categories - Cần hoàn thiện
4. ⚠️ Cart - Cần hoàn thiện
5. ⚠️ Orders - Cần hoàn thiện

### Phase 2: Additional Features
6. Users management
7. Reviews
8. Coupons
9. Upload

### Phase 3: Advanced
10. Notifications
11. Analytics
12. Reports

---

## 📝 CHECKLIST KHI TẠO MODULE

Mỗi module cần:
- [ ] Module file (.module.ts)
- [ ] Controller file (.controller.ts)
- [ ] Service file (.service.ts)
- [ ] DTOs (create, update, filter)
- [ ] Import vào AppModule
- [ ] Add Swagger tags
- [ ] Add Guards nếu cần
- [ ] Test endpoints

---

## 🔥 CODE ĐẦY ĐỦ TẤT CẢ MODULES

Nếu bạn muốn code đầy đủ tất cả modules, tôi có thể:

1. **Tạo riêng từng module** - Từng file một
2. **Tạo script generator** - Tự động generate
3. **Tạo ZIP mới** - Với tất cả modules hoàn thiện

**Bạn muốn cách nào?**

---

## ✅ HIỆN TẠI BẠN CÓ GÌ?

✅ **Đầy đủ để chạy và demo:**
- Database schema hoàn chỉnh (21 bảng)
- Auth system (Register, Login, JWT)
- Products system (với Variants & Specs)
- Docker setup
- Swagger documentation

✅ **Có thể demo được:**
- Register user
- Login
- Create products với variants
- View products
- Xem database qua phpMyAdmin

⚠️ **Cần bổ sung để hoàn thiện:**
- Các modules còn lại (Users, Cart, Orders...)
- Business logic chi tiết
- Error handling
- Validation

---

## 🚀 KHUYẾN NGHỊ

**Cho đồ án tốt nghiệp:**
- ✅ Những gì bạn có là **ĐỦ** để demo và bảo vệ
- ✅ Focus vào 2 tính năng chính: **Dynamic Specs** & **Variants**
- ✅ Nếu cần thêm, tạo 2-3 modules nữa (Cart, Orders)

**Để hoàn thiện production:**
- Cần implement tất cả 10 modules
- Add unit tests
- Add integration tests
- Add error handling đầy đủ
- Add logging
- Add monitoring

---

**Bạn muốn tôi:**
1. Tạo đầy đủ tất cả modules? (sẽ mất thời gian)
2. Tạo thêm 3-4 modules quan trọng nhất? (Cart, Orders, Categories)
3. Giữ nguyên và hướng dẫn bạn tự phát triển?

Cho tôi biết! 😊
