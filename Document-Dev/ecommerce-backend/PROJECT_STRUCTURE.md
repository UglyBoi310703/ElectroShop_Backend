# 🏗️ CẤU TRÚC PROJECT NESTJS BACKEND

## 📂 Tổng Quan Cấu Trúc

```
ecommerce-backend/
│
├── 📁 src/                              # Source code chính
│   │
│   ├── 📁 modules/                      # Feature modules (Business logic)
│   │   │
│   │   ├── 📁 auth/                    # Authentication & Authorization
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts      # POST /auth/login, /auth/register
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── local.strategy.ts
│   │   │   └── dto/
│   │   │       ├── login.dto.ts
│   │   │       └── register.dto.ts
│   │   │
│   │   ├── 📁 users/                   # User management
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts     # GET/PUT /users/:id
│   │   │   ├── users.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── 📁 categories/              # Category management
│   │   │   ├── categories.module.ts
│   │   │   ├── categories.controller.ts
│   │   │   ├── categories.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── 📁 brands/                  # Brand management
│   │   │   └── ...
│   │   │
│   │   ├── 📁 products/                # 🔥 Products (Core module)
│   │   │   ├── products.module.ts
│   │   │   ├── products.controller.ts   # CRUD products
│   │   │   ├── products.service.ts      # Business logic
│   │   │   └── dto/
│   │   │       ├── create-product.dto.ts
│   │   │       ├── update-product.dto.ts
│   │   │       └── filter-product.dto.ts
│   │   │
│   │   ├── 📁 specifications/          # 🔥 Dynamic Specifications
│   │   │   ├── specifications.module.ts
│   │   │   ├── specifications.controller.ts
│   │   │   ├── specifications.service.ts
│   │   │   └── dto/
│   │   │       ├── create-spec-template.dto.ts
│   │   │       └── save-product-spec.dto.ts
│   │   │
│   │   ├── 📁 variants/                # 🔥 Product Variants
│   │   │   ├── variants.module.ts
│   │   │   ├── variants.controller.ts
│   │   │   ├── variants.service.ts
│   │   │   └── dto/
│   │   │       ├── create-variant-attribute.dto.ts
│   │   │       ├── create-variant-option.dto.ts
│   │   │       └── create-product-variant.dto.ts
│   │   │
│   │   ├── 📁 cart/                    # Shopping cart
│   │   │   ├── cart.module.ts
│   │   │   ├── cart.controller.ts
│   │   │   ├── cart.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── 📁 orders/                  # Order management
│   │   │   ├── orders.module.ts
│   │   │   ├── orders.controller.ts
│   │   │   ├── orders.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── 📁 reviews/                 # Product reviews
│   │   │   └── ...
│   │   │
│   │   ├── 📁 coupons/                 # Discount coupons
│   │   │   └── ...
│   │   │
│   │   └── 📁 upload/                  # File upload
│   │       ├── upload.module.ts
│   │       ├── upload.controller.ts
│   │       └── upload.service.ts
│   │
│   ├── 📁 entities/                     # TypeORM Entities (Database models)
│   │   ├── user.entity.ts              # Users table
│   │   ├── category.entity.ts          # Categories table
│   │   ├── brand.entity.ts             # Brands table
│   │   ├── product.entity.ts           # Products table 🔥
│   │   ├── product-image.entity.ts     # Product images
│   │   ├── product-specification.entity.ts  # Product specs 🔥
│   │   ├── category-specification-template.entity.ts  # Spec templates 🔥
│   │   ├── product-variant.entity.ts   # Product variants 🔥
│   │   ├── variant-attribute.entity.ts # Variant attributes 🔥
│   │   ├── variant-option.entity.ts    # Variant options 🔥
│   │   ├── cart.entity.ts              # Shopping carts
│   │   ├── cart-item.entity.ts         # Cart items
│   │   ├── order.entity.ts             # Orders
│   │   ├── order-item.entity.ts        # Order items
│   │   ├── review.entity.ts            # Product reviews
│   │   └── coupon.entity.ts            # Discount coupons
│   │
│   ├── 📁 common/                       # Shared utilities
│   │   │
│   │   ├── 📁 decorators/              # Custom decorators
│   │   │   ├── roles.decorator.ts      # @Roles('admin')
│   │   │   ├── current-user.decorator.ts # @CurrentUser()
│   │   │   └── public.decorator.ts     # @Public()
│   │   │
│   │   ├── 📁 guards/                  # Route guards
│   │   │   ├── jwt-auth.guard.ts       # JWT authentication
│   │   │   └── roles.guard.ts          # Role-based access
│   │   │
│   │   ├── 📁 filters/                 # Exception filters
│   │   │   ├── http-exception.filter.ts
│   │   │   └── all-exceptions.filter.ts
│   │   │
│   │   ├── 📁 interceptors/            # Interceptors
│   │   │   ├── transform.interceptor.ts # Response transformation
│   │   │   └── logging.interceptor.ts   # Request logging
│   │   │
│   │   ├── 📁 pipes/                   # Validation pipes
│   │   │   └── validation.pipe.ts
│   │   │
│   │   └── 📁 interfaces/              # TypeScript interfaces
│   │       ├── jwt-payload.interface.ts
│   │       └── response.interface.ts
│   │
│   ├── 📁 config/                       # Configuration files
│   │   ├── database.config.ts          # Database configuration
│   │   ├── jwt.config.ts               # JWT configuration
│   │   └── multer.config.ts            # File upload config
│   │
│   ├── 📁 database/                     # Database related
│   │   ├── 📁 migrations/              # Database migrations
│   │   └── 📁 seeds/                   # Database seeders
│   │       └── seed.ts
│   │
│   ├── 📄 app.module.ts                # Root application module
│   └── 📄 main.ts                      # Application entry point
│
├── 📁 uploads/                          # Uploaded files storage
│   └── .gitkeep
│
├── 📁 init-db/                          # Database initialization
│   └── init.sh
│
├── 📄 docker-compose.yml               # Docker services definition
├── 📄 Dockerfile                       # Docker image build
├── 📄 .env.example                     # Environment variables template
├── 📄 .gitignore                       # Git ignore rules
├── 📄 package.json                     # NPM dependencies
├── 📄 tsconfig.json                    # TypeScript configuration
├── 📄 nest-cli.json                    # NestJS CLI configuration
├── 📄 README.md                        # Main documentation
├── 📄 SETUP_GUIDE.md                   # Setup instructions
└── 📄 PROJECT_STRUCTURE.md             # This file
```

---

## 🎯 Modules Chi Tiết

### 1. Auth Module (Authentication)
**Chức năng:**
- User registration
- Login (JWT)
- Refresh token
- Password reset
- Email verification

**Endpoints:**
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/auth/profile`

---

### 2. Products Module 🔥 (Core)
**Chức năng:**
- CRUD products
- Product variants
- Product specifications
- Product images
- Search & filter
- Pagination

**Endpoints:**
- `GET /api/v1/products` - List products với filters
- `GET /api/v1/products/:slug` - Chi tiết sản phẩm
- `POST /api/v1/products` - Tạo sản phẩm (Seller/Admin)
- `PUT /api/v1/products/:id` - Update sản phẩm
- `DELETE /api/v1/products/:id` - Xóa sản phẩm
- `GET /api/v1/products/:id/specifications` - Lấy specs
- `POST /api/v1/products/:id/specifications` - Lưu specs
- `GET /api/v1/products/:id/variants` - Lấy variants
- `POST /api/v1/products/:id/variants` - Tạo variants

---

### 3. Specifications Module 🔥 (Dynamic Specs)
**Chức năng:**
- Quản lý spec templates theo category
- Tự động load specs khi chọn category
- Support nhiều loại input: text, number, select, multiselect

**Endpoints:**
- `GET /api/v1/categories/:id/spec-templates`
- `POST /api/v1/categories/:id/spec-templates`
- `PUT /api/v1/spec-templates/:id`
- `DELETE /api/v1/spec-templates/:id`

---

### 4. Variants Module 🔥 (Product Variants)
**Chức năng:**
- Quản lý variant attributes (Storage, Color...)
- Quản lý variant options (128GB, 256GB...)
- Tạo product variants với giá riêng
- Calculate giá tự động

**Endpoints:**
- `GET /api/v1/categories/:id/variant-attributes`
- `POST /api/v1/categories/:id/variant-attributes`
- `GET /api/v1/variant-attributes/:id/options`
- `POST /api/v1/variant-attributes/:id/options`

---

### 5. Cart Module (Shopping Cart)
**Chức năng:**
- Add/remove items
- Update quantity
- Support variants
- Auto calculate total

**Endpoints:**
- `GET /api/v1/cart`
- `POST /api/v1/cart/items`
- `PUT /api/v1/cart/items/:id`
- `DELETE /api/v1/cart/items/:id`

---

### 6. Orders Module (Order Management)
**Chức năng:**
- Checkout
- Order tracking
- Status updates
- Order history

**Endpoints:**
- `GET /api/v1/orders`
- `GET /api/v1/orders/:id`
- `POST /api/v1/orders` (Checkout)
- `PUT /api/v1/orders/:id/status`

---

## 🗄️ Database Entities

### Core Entities:
1. **User** - Người dùng
2. **Category** - Danh mục (tree structure)
3. **Brand** - Thương hiệu
4. **Product** - Sản phẩm chính
5. **ProductImage** - Hình ảnh SP
6. **ProductSpecification** - Thông số kỹ thuật
7. **CategorySpecificationTemplate** - Template specs 🔥
8. **ProductVariant** - Biến thể SP 🔥
9. **VariantAttribute** - Thuộc tính variant 🔥
10. **VariantOption** - Giá trị variant 🔥
11. **Cart** - Giỏ hàng
12. **CartItem** - Item trong giỏ
13. **Order** - Đơn hàng
14. **OrderItem** - Item trong đơn
15. **Review** - Đánh giá
16. **Coupon** - Mã giảm giá

---

## 🔄 Data Flow

### Flow 1: Create Product với Variants

```
Admin (Frontend)
    ↓
    1. Chọn Category: "iPhone"
    ↓
GET /categories/4/spec-templates
    ↓
    2. Backend trả về spec templates
    ↓
    3. Admin nhập specs + variants
    ↓
POST /products
    {
      categoryId: 4,
      productName: "iPhone 15 Pro Max",
      basePrice: 33990000,
      hasVariants: true,
      specifications: [...],
      variants: [
        {
          variantName: "256GB Đen",
          price: 36990000,
          attributeValues: {
            storage: "256GB",
            color: "Đen"
          }
        }
      ]
    }
    ↓
ProductsService.create()
    ↓
    4. Save product
    5. Save specifications
    6. Save variants
    ↓
Response: Product created ✅
```

### Flow 2: Customer mua hàng

```
Customer (Frontend)
    ↓
    1. View product page
    ↓
GET /products/iphone-15-pro-max
    ↓
    2. Backend trả về product + variants
    ↓
    3. Chọn variant: 256GB Đen
    ↓
POST /cart/items
    {
      productId: 1,
      variantId: 5,
      quantity: 1
    }
    ↓
CartService.addItem()
    ↓
    4. Check stock
    5. Add to cart
    ↓
    6. Checkout
    ↓
POST /orders
    {
      shippingAddressId: 1,
      paymentMethod: "bank_transfer"
    }
    ↓
OrdersService.create()
    ↓
    7. Create order
    8. Create order items
    9. Update stock
    10. Clear cart
    ↓
Response: Order created ✅
```

---

## 🛡️ Guards & Decorators

### Guards:
- **JwtAuthGuard**: Kiểm tra JWT token
- **RolesGuard**: Kiểm tra role (admin, seller, customer)

### Custom Decorators:
```typescript
// Usage examples:

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'seller')
async createProduct() { }

@Public()  // Skip authentication
async getProducts() { }

@CurrentUser()
async getProfile(@CurrentUser() user: User) { }
```

---

## 📦 Dependency Injection

NestJS sử dụng DI pattern:

```typescript
// Service
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}
}

// Controller
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService
  ) {}
}
```

---

## 🔧 Configuration

### Environment Variables (.env):
```env
# Database
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=ecommerce_user
DB_PASSWORD=ecommerce_password
DB_DATABASE=ecommerce_db

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
```

### TypeORM Configuration:
```typescript
TypeOrmModule.forRoot({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false, // Use migrations in production
})
```

---

## 🚀 Deployment

### Development:
```bash
npm run start:dev
```

### Production:
```bash
docker-compose up -d
```

---

## 📚 Tài liệu tham khảo

- NestJS: https://docs.nestjs.com
- TypeORM: https://typeorm.io
- Docker: https://docs.docker.com

---

**Cấu trúc này đảm bảo:**
- ✅ Clean Architecture
- ✅ SOLID Principles
- ✅ Separation of Concerns
- ✅ Easy to Test
- ✅ Easy to Scale
- ✅ Easy to Maintain
