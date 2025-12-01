# 🚀 HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY PROJECT

## 📋 Mục Lục
1. [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
2. [Cài Đặt Nhanh](#cài-đặt-nhanh)
3. [Cấu Trúc Project](#cấu-trúc-project)
4. [Chi Tiết Setup](#chi-tiết-setup)
5. [Database Setup](#database-setup)
6. [Testing API](#testing-api)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Yêu Cầu Hệ Thống

### Bắt buộc:
- **Docker Desktop**: 20.10+
- **Docker Compose**: 2.0+
- **Git**: Bất kỳ version nào

### Optional (cho local development):
- **Node.js**: 20+
- **npm**: 9+
- **MySQL Workbench**: Để quản lý database
- **Postman/Insomnia**: Để test API

---

## ⚡ Cài Đặt Nhanh (5 phút)

### Windows/Mac/Linux

```bash
# 1. Clone project (hoặc download ZIP và extract)
git clone <repository-url>
cd ecommerce-backend

# 2. Copy environment file
cp .env.example .env

# 3. Start tất cả services với Docker
docker-compose up -d

# 4. Đợi 30 giây để services khởi động
# Sau đó truy cập:
# - API: http://localhost:3000/api
# - Swagger: http://localhost:3000/api/docs
# - phpMyAdmin: http://localhost:8080

# 5. Import database schema
docker-compose exec mysql mysql -u ecommerce_user -pecommerce_password ecommerce_db < complete_graduation_database.sql
```

**Xong! 🎉 Backend đã chạy!**

---

## 📁 Cấu Trúc Project

```
ecommerce-backend/
│
├── src/                          # Source code
│   ├── modules/                  # Feature modules
│   │   ├── auth/                # Authentication
│   │   ├── users/               # User management
│   │   ├── products/            # Products với variants
│   │   ├── specifications/      # Dynamic specs
│   │   ├── cart/                # Shopping cart
│   │   ├── orders/              # Orders
│   │   └── ...
│   │
│   ├── entities/                # TypeORM entities
│   │   ├── user.entity.ts
│   │   ├── product.entity.ts
│   │   ├── product-variant.entity.ts
│   │   └── ...
│   │
│   ├── common/                  # Shared resources
│   │   ├── decorators/
│   │   ├── guards/
│   │   ├── filters/
│   │   └── pipes/
│   │
│   ├── config/                  # Configuration
│   ├── app.module.ts            # Root module
│   └── main.ts                  # Entry point
│
├── uploads/                      # Uploaded files
├── complete_graduation_database.sql  # Database schema
├── docker-compose.yml           # Docker services
├── Dockerfile                   # Backend image
├── package.json                 # Dependencies
├── .env.example                 # Environment template
└── README.md                    # Documentation
```

---

## 🐳 Chi Tiết Setup với Docker

### Bước 1: Chuẩn bị môi trường

```bash
# Clone hoặc download project
cd ecommerce-backend

# Tạo file .env
cp .env.example .env

# (Optional) Chỉnh sửa .env nếu cần
# Mặc định đã OK để chạy
nano .env
```

### Bước 2: Start Docker Services

```bash
# Build và start tất cả services
docker-compose up -d

# Xem logs
docker-compose logs -f

# Kiểm tra services đang chạy
docker-compose ps
```

**Expected output:**
```
NAME                    STATUS              PORTS
ecommerce-backend       Up                  0.0.0.0:3000->3000/tcp
ecommerce-mysql         Up (healthy)        0.0.0.0:3306->3306/tcp
ecommerce-redis         Up (healthy)        0.0.0.0:6379->6379/tcp
ecommerce-phpmyadmin    Up                  0.0.0.0:8080->80/tcp
```

### Bước 3: Import Database

**Option 1: Từ host machine**
```bash
# Copy SQL file vào container
docker cp complete_graduation_database.sql ecommerce-mysql:/tmp/

# Import
docker-compose exec mysql mysql -u ecommerce_user -pecommerce_password ecommerce_db < /tmp/complete_graduation_database.sql
```

**Option 2: Qua phpMyAdmin**
1. Mở http://localhost:8080
2. Login: `root` / `root_password`
3. Chọn database `ecommerce_db`
4. Tab "Import" → Chọn file SQL → Go

### Bước 4: Verify

```bash
# Test API health
curl http://localhost:3000/api

# Mở Swagger documentation
open http://localhost:3000/api/docs  # Mac
start http://localhost:3000/api/docs # Windows
```

---

## 💻 Local Development (không dùng Docker)

Nếu muốn chạy NestJS trực tiếp trên máy:

### Bước 1: Cài đặt dependencies

```bash
npm install
```

### Bước 2: Start MySQL & Redis bằng Docker

```bash
# Chỉ start database services
docker-compose up -d mysql redis
```

### Bước 3: Import database

```bash
mysql -h 127.0.0.1 -u ecommerce_user -pecommerce_password ecommerce_db < complete_graduation_database.sql
```

### Bước 4: Start development server

```bash
# Development mode với hot reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

---

## 📊 Database Setup Chi Tiết

### Kết nối MySQL

**Từ host machine:**
```
Host: localhost
Port: 3306
Username: ecommerce_user
Password: ecommerce_password
Database: ecommerce_db
```

**Từ phpMyAdmin:**
- URL: http://localhost:8080
- Username: `root`
- Password: `root_password`

### Import Database

1. **Complete Schema** (bắt buộc):
```bash
mysql -h localhost -u ecommerce_user -pecommerce_password ecommerce_db < complete_graduation_database.sql
```

2. **Sample Data** (optional - dữ liệu mẫu):
```bash
mysql -h localhost -u ecommerce_user -pecommerce_password ecommerce_db < complete_sample_data.sql
```

### Verify Database

```sql
-- Connect to MySQL
mysql -h localhost -u ecommerce_user -pecommerce_password ecommerce_db

-- Check tables
SHOW TABLES;

-- Check users
SELECT * FROM users;

-- Check products
SELECT * FROM products;

-- Check variants
SELECT * FROM product_variants;
```

---

## 🧪 Testing API

### Sử dụng Swagger UI

1. Mở http://localhost:3000/api/docs
2. Explore các endpoints
3. Try out các API

### Sử dụng curl

#### 1. Register User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User",
    "phone": "0901234567"
  }'
```

#### 2. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": 1,
    "email": "test@example.com",
    "fullName": "Test User"
  }
}
```

#### 3. Get Products
```bash
curl http://localhost:3000/api/v1/products
```

#### 4. Get Product by Slug
```bash
curl http://localhost:3000/api/v1/products/iphone-15-pro-max
```

#### 5. Create Product (cần token)
```bash
TOKEN="your-access-token"

curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "categoryId": 4,
    "brandId": 1,
    "productName": "iPhone 15 Pro Max",
    "slug": "iphone-15-pro-max",
    "basePrice": 33990000,
    "hasVariants": true,
    "status": "active"
  }'
```

### Sử dụng Postman

1. Import Postman Collection (nếu có)
2. Set environment variable:
   - `base_url`: http://localhost:3000/api/v1
   - `token`: Your JWT token

---

## 🔍 Troubleshooting

### Issue 1: Port đã được sử dụng

**Lỗi:**
```
Error: bind: address already in use
```

**Giải pháp:**
```bash
# Kiểm tra port đang sử dụng
# Windows
netstat -ano | findstr :3000

# Mac/Linux
lsof -i :3000

# Kill process hoặc đổi port trong .env
PORT=3001
```

### Issue 2: Database connection failed

**Lỗi:**
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Giải pháp:**
```bash
# Kiểm tra MySQL container
docker-compose ps mysql

# Restart MySQL
docker-compose restart mysql

# Xem logs
docker-compose logs mysql
```

### Issue 3: Cannot import SQL file

**Lỗi:**
```
ERROR: Unknown database 'ecommerce_db'
```

**Giải pháp:**
```bash
# Tạo database thủ công
docker-compose exec mysql mysql -u root -proot_password -e "CREATE DATABASE IF NOT EXISTS ecommerce_db;"

# Import lại
docker-compose exec mysql mysql -u ecommerce_user -pecommerce_password ecommerce_db < complete_graduation_database.sql
```

### Issue 4: Redis connection error

**Giải pháp:**
```bash
# Restart Redis
docker-compose restart redis

# Hoặc disable cache tạm thời trong .env
REDIS_ENABLED=false
```

### Issue 5: Permission denied trên Linux

**Giải pháp:**
```bash
# Add user vào docker group
sudo usermod -aG docker $USER

# Logout và login lại
# Hoặc dùng sudo
sudo docker-compose up -d
```

---

## 🛠️ Useful Commands

### Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f backend

# Execute command in container
docker-compose exec backend npm run migration:run

# Rebuild images
docker-compose build --no-cache

# Remove all containers and volumes
docker-compose down -v
```

### NPM Commands

```bash
# Install dependencies
npm install

# Development
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Test
npm run test

# Lint
npm run lint
```

### Database Commands

```bash
# Backup database
docker-compose exec mysql mysqldump -u ecommerce_user -pecommerce_password ecommerce_db > backup.sql

# Restore database
docker-compose exec -T mysql mysql -u ecommerce_user -pecommerce_password ecommerce_db < backup.sql

# Access MySQL CLI
docker-compose exec mysql mysql -u ecommerce_user -pecommerce_password ecommerce_db
```

---

## 📚 Tài Liệu Bổ Sung

- [API Documentation](http://localhost:3000/api/docs)
- [Database Schema](./DETAILED_ERD.md)
- [Graduation Thesis Docs](./GRADUATION_THESIS_DOCUMENTATION.md)

---

## 💡 Tips

1. **Development**: Dùng `npm run start:dev` để có hot reload
2. **Database**: Dùng phpMyAdmin để xem/sửa dữ liệu dễ hơn
3. **API Testing**: Swagger UI có sẵn, không cần Postman
4. **Logs**: Dùng `docker-compose logs -f` để debug
5. **Cache**: Nếu có lỗi lạ, thử restart Redis

---

## 🎯 Next Steps

Sau khi setup xong:

1. ✅ Test các API endpoints
2. ✅ Tạo admin user
3. ✅ Tạo categories
4. ✅ Tạo products với variants
5. ✅ Test shopping cart
6. ✅ Test checkout flow

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Check logs: `docker-compose logs -f`
2. Check database connection
3. Verify .env configuration
4. Restart services: `docker-compose restart`

---

**Happy Coding! 🚀**
