# 🚀 E-commerce Backend API - NestJS + Docker + MySQL

Backend API hoàn chỉnh cho sàn thương mại điện tử bán đồ điện tử, được xây dựng với NestJS, TypeORM, MySQL và Docker.

## 📋 Tính năng chính

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Customer, Seller, Admin)
- Refresh token mechanism
- Password hashing with bcrypt

### 📦 Product Management
- **Dynamic Specifications**: Thông số kỹ thuật tự động theo category
- **Product Variants**: Biến thể sản phẩm với giá khác nhau
- Product images management
- Full-text search
- Filtering & sorting

### 🛒 Shopping Features
- Shopping cart
- Order management
- Order status tracking
- Multiple payment methods

### ⭐ Additional Features
- Product reviews & ratings
- Coupon system
- Wishlist
- Redis caching
- Rate limiting
- Swagger API documentation

---

## 🏗️ Kiến trúc

```
ecommerce-backend/
├── src/
│   ├── modules/              # Feature modules
│   │   ├── auth/            # Authentication
│   │   ├── users/           # User management
│   │   ├── categories/      # Categories
│   │   ├── brands/          # Brands
│   │   ├── products/        # Products
│   │   ├── specifications/  # Dynamic specs
│   │   ├── variants/        # Product variants
│   │   ├── cart/            # Shopping cart
│   │   ├── orders/          # Orders
│   │   ├── reviews/         # Reviews
│   │   ├── coupons/         # Coupons
│   │   └── upload/          # File upload
│   ├── entities/            # TypeORM entities
│   ├── common/              # Shared resources
│   │   ├── decorators/      # Custom decorators
│   │   ├── guards/          # Auth guards
│   │   ├── filters/         # Exception filters
│   │   ├── interceptors/    # Interceptors
│   │   └── pipes/           # Validation pipes
│   ├── config/              # Configuration
│   ├── database/            # Database seeds & migrations
│   ├── app.module.ts        # Root module
│   └── main.ts              # Entry point
├── uploads/                  # Uploaded files
├── docker-compose.yml        # Docker services
├── Dockerfile               # Docker image
└── package.json             # Dependencies
```

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)
- Git

### 1. Clone & Setup

```bash
# Clone repository
git clone <repository-url>
cd ecommerce-backend

# Copy environment file
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

### 2. Start with Docker

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

**Services:**
- Backend API: http://localhost:3000
- MySQL: localhost:3306
- Redis: localhost:6379
- phpMyAdmin: http://localhost:8080
- Swagger Docs: http://localhost:3000/api/docs

### 3. Local Development (without Docker)

```bash
# Install dependencies
npm install

# Start MySQL and Redis (use Docker)
docker-compose up -d mysql redis

# Run migrations
npm run migration:run

# Run seeds (optional)
npm run seed

# Start development server
npm run start:dev
```

---

## 📊 Database Schema

### Core Entities

#### 1. Dynamic Specifications System

```typescript
// Category defines what specs are needed
Category (iPhone)
  └── CategorySpecificationTemplate[]
      ├── "Chip xử lý" (select) → ["A17 Pro", "A16"]
      ├── "RAM" (select) → ["6GB", "8GB"]
      └── "Camera" (text)

// Product stores actual values
Product (iPhone 15 Pro Max)
  └── ProductSpecification[]
      ├── "cpu": "Apple A17 Pro"
      ├── "ram": "8"
      └── "camera": "48MP + 12MP + 12MP"
```

#### 2. Product Variants System

```typescript
// Define attributes for category
VariantAttribute (for iPhone)
  ├── "storage" → ["128GB", "256GB", "512GB", "1TB"]
  └── "color" → ["Đen", "Trắng", "Xanh"]

// Each product can have multiple variants
Product (iPhone 15 Pro Max)
  └── ProductVariant[]
      ├── "256GB - Đen" (price: 36,990,000đ, stock: 22)
      ├── "256GB - Trắng" (price: 36,990,000đ, stock: 18)
      └── "512GB - Đen" (price: 40,990,000đ, stock: 12)
```

---

## 📡 API Endpoints

### Authentication
```http
POST   /api/v1/auth/register          # Register new user
POST   /api/v1/auth/login             # Login
POST   /api/v1/auth/refresh           # Refresh token
POST   /api/v1/auth/logout            # Logout
GET    /api/v1/auth/profile           # Get current user
```

### Categories
```http
GET    /api/v1/categories             # Get all categories
GET    /api/v1/categories/:id         # Get category by ID
POST   /api/v1/categories             # Create category (Admin)
PUT    /api/v1/categories/:id         # Update category (Admin)
DELETE /api/v1/categories/:id         # Delete category (Admin)

# Dynamic Specifications
GET    /api/v1/categories/:id/spec-templates    # Get spec templates
POST   /api/v1/categories/:id/spec-templates    # Create spec template (Admin)
```

### Products
```http
GET    /api/v1/products               # Get all products (with filters)
GET    /api/v1/products/:slug         # Get product by slug
POST   /api/v1/products               # Create product (Seller/Admin)
PUT    /api/v1/products/:id           # Update product (Seller/Admin)
DELETE /api/v1/products/:id           # Delete product (Seller/Admin)

# Product Specifications
GET    /api/v1/products/:id/specifications     # Get product specs
POST   /api/v1/products/:id/specifications     # Save product specs

# Product Variants
GET    /api/v1/products/:id/variants           # Get product variants
POST   /api/v1/products/:id/variants           # Create variants
PUT    /api/v1/products/:id/variants/:variantId # Update variant
DELETE /api/v1/products/:id/variants/:variantId # Delete variant
```

### Variants
```http
GET    /api/v1/categories/:id/variant-attributes    # Get variant attributes
POST   /api/v1/categories/:id/variant-attributes    # Create attribute (Admin)
```

### Cart
```http
GET    /api/v1/cart                   # Get current cart
POST   /api/v1/cart/items             # Add item to cart
PUT    /api/v1/cart/items/:id         # Update cart item quantity
DELETE /api/v1/cart/items/:id         # Remove item from cart
DELETE /api/v1/cart                   # Clear cart
```

### Orders
```http
GET    /api/v1/orders                 # Get user orders
GET    /api/v1/orders/:id             # Get order details
POST   /api/v1/orders                 # Create order (checkout)
PUT    /api/v1/orders/:id/status      # Update order status (Admin)
DELETE /api/v1/orders/:id             # Cancel order
```

### Reviews
```http
GET    /api/v1/products/:id/reviews   # Get product reviews
POST   /api/v1/products/:id/reviews   # Create review
PUT    /api/v1/reviews/:id            # Update review
DELETE /api/v1/reviews/:id            # Delete review
```

---

## 🔧 Environment Variables

```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api

# Database
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=ecommerce_user
DB_PASSWORD=ecommerce_password
DB_DATABASE=ecommerce_db

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=7d

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_TTL=3600

# Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# CORS
CORS_ORIGIN=http://localhost:3001,http://localhost:5173

# Swagger
SWAGGER_ENABLED=true
SWAGGER_PATH=api/docs
```

---

## 📝 API Examples

### 1. Register & Login

```bash
# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "password123",
    "fullName": "John Doe",
    "phone": "0901234567"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "password123"
  }'

# Response:
{
  "accessToken": "eyJhbGciOiJIUzI1...",
  "refreshToken": "eyJhbGciOiJIUzI1...",
  "user": {
    "userId": 1,
    "email": "customer@example.com",
    "fullName": "John Doe",
    "userType": "customer"
  }
}
```

### 2. Get Category Spec Templates

```bash
# Get spec templates for iPhone category
curl -X GET http://localhost:3000/api/v1/categories/4/spec-templates

# Response:
{
  "success": true,
  "data": {
    "Màn hình": [
      {
        "templateId": 1,
        "specName": "Kích thước màn hình",
        "specKey": "screen_size",
        "specType": "select",
        "specUnit": "inch",
        "specOptions": ["6.1", "6.7"],
        "isRequired": true
      }
    ],
    "Hiệu năng": [...]
  }
}
```

### 3. Create Product with Variants

```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "categoryId": 4,
    "brandId": 1,
    "productName": "iPhone 15 Pro Max",
    "slug": "iphone-15-pro-max",
    "shortDescription": "iPhone 15 Pro Max - Titan",
    "basePrice": 33990000,
    "hasVariants": true,
    "specifications": [
      {"templateId": 1, "value": "6.7"},
      {"templateId": 4, "value": "Apple A17 Pro"}
    ],
    "variants": [
      {
        "variantName": "iPhone 15 Pro Max 256GB Đen",
        "sku": "IP15PM-256-BK",
        "price": 36990000,
        "quantityInStock": 22,
        "attributeValues": {
          "storage": "256GB",
          "color": "Đen"
        }
      }
    ]
  }'
```

### 4. Add to Cart

```bash
curl -X POST http://localhost:3000/api/v1/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "productId": 1,
    "variantId": 5,
    "quantity": 1
  }'
```

### 5. Create Order (Checkout)

```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "shippingAddressId": 1,
    "paymentMethod": "bank_transfer",
    "customerNote": "Giao hàng giờ hành chính"
  }'
```

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## 📦 Deployment

### Docker Production

```bash
# Build production image
docker build -t ecommerce-backend:latest --target production .

# Run production container
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DB_HOST=your-mysql-host \
  -e DB_PASSWORD=your-password \
  --name ecommerce-backend \
  ecommerce-backend:latest
```

### PM2 Deployment

```bash
# Install PM2
npm install -g pm2

# Build
npm run build

# Start with PM2
pm2 start dist/main.js --name ecommerce-backend

# Monitor
pm2 monit

# Logs
pm2 logs ecommerce-backend
```

---

## 🔒 Security

- **Helmet**: Security headers
- **CORS**: Configured CORS
- **Rate Limiting**: API rate limiting
- **JWT**: Token-based authentication
- **Password Hashing**: bcrypt
- **Input Validation**: class-validator
- **SQL Injection**: TypeORM parameterized queries

---

## 📚 Technology Stack

- **Framework**: NestJS 10
- **Language**: TypeScript 5
- **Database**: MySQL 8.0
- **ORM**: TypeORM 0.3
- **Cache**: Redis 7
- **Authentication**: Passport JWT
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Container**: Docker & Docker Compose

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

MIT License

---

## 👨‍💻 Author

**Your Name**
- Email: your.email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- NestJS Documentation
- TypeORM Documentation
- MySQL Documentation
- Docker Documentation

---

## 📞 Support

For support, email your.email@example.com or open an issue on GitHub.

---

**Happy Coding! 🚀**
