# 🚀 QUICK START GUIDE

## ⚡ 5-Minute Setup

### Step 1: Clone & Install
```bash
cd ecommerce-backend
npm install
```

### Step 2: Database
```bash
# Option A: Docker (Recommended - Easiest)
docker-compose up -d

# Option B: Manual MySQL
mysql -u root -p < complete_database.sql
```

### Step 3: Environment
```bash
# Copy example file
cp .env.example .env

# .env already configured for Docker setup
# If using manual MySQL, update database credentials
```

### Step 4: Start Server
```bash
npm run start:dev
```

### Step 5: Test API
Open in browser:
- **API Docs**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/health

---

## 🧪 Test Credentials

### Admin User
```
Email: admin@ecommerce.com
Password: admin123
Role: admin
```

### Create Test User
```bash
# Register new user via API
POST http://localhost:3000/api/v1/auth/register

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Test User",
  "phone": "0901234567"
}
```

---

## 📱 Sample API Calls

### 1. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ecommerce.com",
    "password": "admin123"
  }'
```

### 2. List Products
```bash
curl -X GET "http://localhost:3000/api/v1/products?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Create Product (Seller/Admin)
```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "categoryId": 1,
    "productName": "iPhone 15 Pro",
    "slug": "iphone-15-pro",
    "basePrice": 30000000,
    "hasVariants": true
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
    "quantity": 2
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
    "couponCode": "SUMMER2024"
  }'
```

---

## 🛠️ Useful Commands

```bash
# Development with auto-reload
npm run start:dev

# Production build
npm run build

# Production run
npm run start:prod

# Lint code
npm run lint

# Format code
npm run format

# Run tests
npm run test

# Run tests with coverage
npm run test:cov

# Database seed (populate test data)
npm run seed

# Database migrations
npm run migration:generate
npm run migration:run
npm run migration:revert
```

---

## 🗺️ Project Map

```
src/
├── modules/
│   ├── auth/              ← Login, Register, JWT
│   ├── users/             ← User profile, Password change
│   ├── products/          ← Product CRUD, Search
│   ├── categories/        ← Categories (Hierarchical)
│   ├── brands/            ← Brands
│   ├── variants/          ← Product variants
│   ├── specifications/    ← Dynamic specs per category
│   ├── cart/              ← Shopping cart
│   ├── orders/            ← Order management
│   ├── reviews/           ← Product reviews, ratings
│   ├── coupons/           ← Discount codes
│   └── upload/            ← File upload
│
├── entities/              ← 20 Database entities
├── common/
│   ├── guards/            ← JWT auth, Roles
│   ├── decorators/        ← @CurrentUser, @Roles
│   ├── filters/           ← Error handling
│   └── interceptors/      ← Response formatting
│
├── config/                ← Database config
├── database/
│   ├── migrations/
│   └── seeds/             ← Sample data
│
├── app.module.ts          ← Root module
└── main.ts                ← Entry point
```

---

## 📚 Key Features

| Feature | Endpoints | Status |
|---------|-----------|--------|
| Authentication | 4 | ✅ Complete |
| Products | 8 | ✅ Complete |
| Cart | 6 | ✅ Complete |
| Orders | 5 | ✅ Complete |
| Reviews | 7 | ✅ Complete |
| Coupons | 4 | ✅ Complete |
| Categories | 6 | ✅ Complete |
| Variants | 8 | ✅ Complete |
| Specifications | 6 | ✅ Complete |
| Upload | 2 | ✅ Complete |
| Brands | 4 | ✅ Complete |
| Users | 3 | ✅ Complete |
| **TOTAL** | **50+** | **✅ Complete** |

---

## 🔑 Important Endpoints

### 🔐 Authentication
```
POST   /auth/register        # Register user
POST   /auth/login           # Login
POST   /auth/refresh         # Refresh token
GET    /auth/profile         # Get profile
```

### 📦 Products (Most Used)
```
GET    /products             # List with filter
GET    /products/:id         # Detail
POST   /products             # Create
PUT    /products/:id         # Update
DELETE /products/:id         # Delete
```

### 🛒 Cart
```
GET    /cart                 # View cart
POST   /cart/items           # Add item
PUT    /cart/items/:id       # Update quantity
DELETE /cart/items/:id       # Remove item
```

### 📋 Orders
```
POST   /orders               # Create order
GET    /orders               # My orders
GET    /orders/:id           # Order detail
PUT    /orders/:id/status    # Update status (Admin)
```

### ⭐ Reviews
```
POST   /reviews              # Create review
GET    /products/:id/reviews # Get reviews
PUT    /reviews/:id          # Update
DELETE /reviews/:id          # Delete
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in .env
PORT=3001

# Or kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### Database Connection Error
```bash
# Check MySQL is running
# Windows: Open Services and start MySQL
# Mac: brew services start mysql
# Linux: sudo systemctl start mysql

# Verify credentials in .env
# Default: user=ecommerce_user, password=ecommerce_password
```

### Dependencies Issue
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port 3306 Already in Use (Docker)
```bash
# Change port in docker-compose.yml
ports:
  - "3307:3306"  # Change left side to different port

# Update .env
DB_PORT=3307
```

---

## 📖 Full Documentation

- **README.md** - Full project overview
- **SETUP_GUIDE.md** - Detailed installation
- **API_REFERENCE.md** - All endpoints with examples
- **PROJECT_STRUCTURE.md** - Architecture details
- **COMPLETION_SUMMARY.md** - What's included

---

## 🎯 What's Included

✅ **50+ API Endpoints**
✅ **20 Database Entities**
✅ **12 Feature Modules**
✅ **JWT Authentication**
✅ **Role-Based Access Control**
✅ **Dynamic Specifications**
✅ **Product Variants**
✅ **Advanced Search & Filter**
✅ **Shopping Cart**
✅ **Order Management**
✅ **Review & Rating System**
✅ **Coupon System**
✅ **File Upload**
✅ **API Documentation (Swagger)**
✅ **Docker Setup**
✅ **Database Seed Data**
✅ **Production Ready**

---

## ✨ Next Steps

1. ✅ Run `docker-compose up -d`
2. ✅ Run `npm install`
3. ✅ Run `npm run start:dev`
4. ✅ Visit http://localhost:3000/api/docs
5. ✅ Test API endpoints with Swagger UI
6. ✅ Create sample data or use seed
7. ✅ Connect with frontend

---

## 📞 Support Resources

- **Swagger UI**: http://localhost:3000/api/docs - Interactive API documentation
- **API Reference**: See API_REFERENCE.md - Complete endpoint guide
- **Setup Issues**: See SETUP_GUIDE.md - Troubleshooting section
- **Architecture**: See PROJECT_STRUCTURE.md - Code organization

---

## 🚀 You're Ready!

Your e-commerce backend is now ready to use. The API is fully functional and documented.

**Next: Connect your frontend application!**

---

**Happy Coding! 🎉**
