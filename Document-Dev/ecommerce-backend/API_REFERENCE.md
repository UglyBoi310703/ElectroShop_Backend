# 🔌 API Endpoints Reference

## 📊 Base Configuration

- **Base URL**: `http://localhost:3000/api/v1`
- **API Prefix**: `/api/v1`
- **API Documentation**: `http://localhost:3000/api/docs`
- **Content-Type**: `application/json`

---

## 🔐 Authentication

### Register
```
POST /auth/register

Body:
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phone": "0901234567"
}

Response: 201 Created
{
  "message": "User registered successfully",
  "user": {
    "userId": 1,
    "email": "user@example.com",
    "fullName": "John Doe"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### Login
```
POST /auth/login

Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "message": "Login successful",
  "user": { ... },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### Refresh Token
```
POST /auth/refresh

Body:
{
  "refreshToken": "eyJhbGc..."
}

Response: 200 OK
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### Get Profile
```
GET /auth/profile

Headers:
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "userId": 1,
  "email": "user@example.com",
  "fullName": "John Doe",
  "phone": "0901234567",
  "userType": "customer",
  "isVerified": true,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

## 👤 Users

### Get User Profile
```
GET /users/profile

Headers:
Authorization: Bearer {accessToken}

Response: 200 OK
{ ... user data ... }
```

### Update Profile
```
PUT /users/profile

Headers:
Authorization: Bearer {accessToken}

Body:
{
  "fullName": "Jane Doe",
  "phone": "0901234568",
  "avatarUrl": "https://..."
}

Response: 200 OK
{ ... updated user data ... }
```

### Change Password
```
POST /users/change-password

Headers:
Authorization: Bearer {accessToken}

Body:
{
  "oldPassword": "password123",
  "newPassword": "newpassword123"
}

Response: 200 OK
{
  "message": "Password changed successfully"
}
```

---

## 📦 Products

### List Products
```
GET /products?page=1&limit=20&categoryId=1&brandId=1&search=iphone&sortBy=newest

Query Parameters:
- page: number (default: 1)
- limit: number (default: 20, max: 100)
- categoryId: number (optional)
- brandId: number (optional)
- minPrice: number (optional)
- maxPrice: number (optional)
- search: string (optional)
- sortBy: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popular'

Response: 200 OK
{
  "data": [ ... products ... ],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

### Get Product Detail
```
GET /products/:id

Response: 200 OK
{
  "productId": 1,
  "productName": "iPhone 15 Pro Max",
  "slug": "iphone-15-pro-max",
  "basePrice": 33990000,
  "shortDescription": "...",
  "fullDescription": "...",
  "category": { ... },
  "brand": { ... },
  "images": [ ... ],
  "specifications": [ ... ],
  "variants": [ ... ],
  "reviews": [ ... ],
  "ratingAverage": 4.5,
  "ratingCount": 120,
  "viewCount": 1500,
  "soldCount": 150
}
```

### Get Product by Slug
```
GET /products/slug/:slug

Response: 200 OK
{ ... same as above ... }
```

### Create Product (Seller/Admin)
```
POST /products

Headers:
Authorization: Bearer {accessToken}

Body:
{
  "categoryId": 1,
  "brandId": 1,
  "productName": "iPhone 15 Pro Max",
  "slug": "iphone-15-pro-max",
  "sku": "IPHONE15PM",
  "basePrice": 33990000,
  "hasVariants": true,
  "shortDescription": "...",
  "fullDescription": "...",
  "quantityInStock": 50,
  "warrantyPeriod": 12
}

Response: 201 Created
{ ... product data ... }
```

### Update Product
```
PUT /products/:id

Headers:
Authorization: Bearer {accessToken}

Body:
{
  "productName": "Updated Name",
  "basePrice": 34990000,
  ... (other fields optional)
}

Response: 200 OK
{ ... updated product ... }
```

### Delete Product
```
DELETE /products/:id

Headers:
Authorization: Bearer {accessToken}

Response: 204 No Content
```

### Get Featured Products
```
GET /products/featured?limit=10

Response: 200 OK
[ ... products ... ]
```

### Search Products
```
GET /products/search/:keyword?limit=10

Response: 200 OK
[ ... search results ... ]
```

---

## 📂 Categories

### List Categories
```
GET /categories

Response: 200 OK
[ ... categories ... ]
```

### Get Category Tree
```
GET /categories/tree

Response: 200 OK
[
  {
    "categoryId": 1,
    "categoryName": "Điện thoại",
    "children": [ ... ]
  }
]
```

### Get Category Detail
```
GET /categories/:id

Response: 200 OK
{
  "categoryId": 1,
  "categoryName": "Điện thoại",
  "slug": "dien-thoai",
  "children": [ ... ]
}
```

### Create Category (Admin)
```
POST /categories

Headers:
Authorization: Bearer {accessToken}

Body:
{
  "categoryName": "Điện thoại",
  "slug": "dien-thoai",
  "description": "...",
  "imageUrl": "...",
  "parentId": null
}

Response: 201 Created
{ ... category data ... }
```

### Update Category (Admin)
```
PUT /categories/:id

Headers:
Authorization: Bearer {accessToken}

Body:
{ ... update fields ... }

Response: 200 OK
{ ... updated category ... }
```

### Delete Category (Admin)
```
DELETE /categories/:id

Headers:
Authorization: Bearer {accessToken}

Response: 204 No Content
```

---

## 🏷️ Brands

### List Brands
```
GET /brands

Response: 200 OK
[ ... brands ... ]
```

### Get Brand Detail
```
GET /brands/:id

Response: 200 OK
{ ... brand data ... }
```

### Create Brand (Admin)
```
POST /brands

Headers:
Authorization: Bearer {accessToken}

Body:
{
  "brandName": "Apple",
  "slug": "apple",
  "logoUrl": "...",
  "description": "...",
  "website": "https://apple.com",
  "country": "USA"
}

Response: 201 Created
{ ... brand data ... }
```

---

## 🔀 Variants

### Get Category Variant Attributes
```
GET /categories/:categoryId/variant-attributes

Response: 200 OK
[
  {
    "attributeId": 1,
    "attributeName": "Màu sắc",
    "attributeKey": "color",
    "variantOptions": [ ... ]
  }
]
```

### Create Variant Attribute (Seller/Admin)
```
POST /categories/:categoryId/variant-attributes

Headers:
Authorization: Bearer {accessToken}

Body:
{
  "attributeName": "Màu sắc",
  "attributeKey": "color"
}

Response: 201 Created
{ ... attribute data ... }
```

### Get Variant Options
```
GET /variant-attributes/:attributeId/options

Response: 200 OK
[
  {
    "optionId": 1,
    "optionValue": "Đen",
    "colorCode": "#000000",
    "extraPrice": 0
  }
]
```

### Create Variant Option (Seller/Admin)
```
POST /variant-attributes/:attributeId/options

Headers:
Authorization: Bearer {accessToken}

Body:
{
  "optionValue": "Đen",
  "colorCode": "#000000",
  "extraPrice": 0
}

Response: 201 Created
{ ... option data ... }
```

### Get Product Variants
```
GET /products/:productId/variants

Response: 200 OK
[
  {
    "variantId": 1,
    "variantName": "iPhone 15 256GB Đen",
    "sku": "IPHONE15-256-BLK",
    "price": 33990000,
    "quantityInStock": 20,
    "attributeValues": { "color": "Đen", "storage": "256GB" }
  }
]
```

### Create Product Variant (Seller/Admin)
```
POST /products/:productId/variants

Headers:
Authorization: Bearer {accessToken}

Body:
{
  "variantName": "iPhone 15 256GB Đen",
  "sku": "IPHONE15-256-BLK",
  "price": 33990000,
  "quantityInStock": 20,
  "attributeValues": {
    "color": "Đen",
    "storage": "256GB"
  }
}

Response: 201 Created
{ ... variant data ... }
```

---

## 🛒 Cart

### Get Cart
```
GET /cart

Headers:
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "cartId": 1,
  "items": [
    {
      "cartItemId": 1,
      "product": { ... },
      "variant": { ... },
      "quantity": 2,
      "price": 33990000
    }
  ],
  "totalPrice": 67980000,
  "totalItems": 1
}
```

### Add to Cart
```
POST /cart/items

Headers:
Authorization: Bearer {accessToken}

Body:
{
  "productId": 1,
  "variantId": 5,
  "quantity": 2
}

Response: 201 Created
{ ... cart item data ... }
```

### Update Cart Item
```
PUT /cart/items/:id

Headers:
Authorization: Bearer {accessToken}

Body:
{
  "quantity": 3
}

Response: 200 OK
{ ... updated item ... }
```

### Remove from Cart
```
DELETE /cart/items/:id

Headers:
Authorization: Bearer {accessToken}

Response: 204 No Content
```

### Clear Cart
```
DELETE /cart

Headers:
Authorization: Bearer {accessToken}

Response: 204 No Content
```

### Get Cart Total
```
GET /cart/total

Headers:
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "total": 67980000
}
```

---

## 📋 Orders

### Create Order (Checkout)
```
POST /orders

Headers:
Authorization: Bearer {accessToken}

Body:
{
  "shippingAddressId": 1,
  "paymentMethod": "bank_transfer",
  "customerNote": "Please deliver carefully",
  "couponCode": "SUMMER2024"
}

Response: 201 Created
{
  "orderId": 1,
  "orderCode": "ORD-1704067200000-xyz",
  "subtotal": 67980000,
  "shippingFee": 0,
  "taxAmount": 6798000,
  "discountAmount": 5000000,
  "totalAmount": 69778000,
  "orderStatus": "pending",
  "paymentStatus": "pending"
}
```

### Get User Orders
```
GET /orders?page=1&limit=10

Headers:
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "data": [ ... orders ... ],
  "total": 5
}
```

### Get Order Detail
```
GET /orders/:id

Headers:
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "orderId": 1,
  "orderCode": "ORD-...",
  "items": [ ... ],
  "totalAmount": 69778000,
  "orderStatus": "pending",
  "paymentStatus": "pending",
  "address": { ... },
  "statusHistory": [ ... ]
}
```

### Update Order Status (Admin)
```
PUT /orders/:id/status

Headers:
Authorization: Bearer {accessToken}

Body:
{
  "orderStatus": "confirmed",
  "adminNote": "Confirmed and ready to ship"
}

Response: 200 OK
{ ... updated order ... }
```

---

## ⭐ Reviews

### Get Product Reviews
```
GET /products/:productId/reviews?page=1&limit=10

Response: 200 OK
{
  "reviews": [ ... ],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

### Create Review
```
POST /reviews

Headers:
Authorization: Bearer {accessToken}

Body:
{
  "productId": 1,
  "variantId": 5,
  "orderId": 1,
  "rating": 5,
  "title": "Excellent product!",
  "comment": "Very satisfied with the purchase",
  "images": ["https://..."]
}

Response: 201 Created
{ ... review data ... }
```

### Update Review
```
PUT /reviews/:id

Headers:
Authorization: Bearer {accessToken}

Body:
{
  "rating": 4,
  "comment": "Updated review"
}

Response: 200 OK
{ ... updated review ... }
```

### Delete Review
```
DELETE /reviews/:id

Headers:
Authorization: Bearer {accessToken}

Response: 204 No Content
```

### Get Rating Summary
```
GET /products/:productId/rating-summary

Response: 200 OK
{
  "average": 4.5,
  "count": 120,
  "distribution": {
    "5": 60,
    "4": 40,
    "3": 15,
    "2": 4,
    "1": 1
  }
}
```

---

## 🎟️ Coupons

### Validate Coupon
```
POST /coupons/validate

Body:
{
  "couponCode": "SUMMER2024",
  "orderTotal": 67980000
}

Response: 200 OK
{
  "isValid": true,
  "coupon": { ... },
  "discount": 5000000,
  "finalTotal": 62980000
}
```

### Get Available Coupons
```
GET /coupons/available

Response: 200 OK
[ ... coupons ... ]
```

---

## 📤 Upload

### Upload Image
```
POST /upload

Headers:
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

Body:
{
  "file": <file>
}

Response: 201 Created
{
  "filename": "uuid.jpg",
  "path": "/uploads/uuid.jpg",
  "url": "/uploads/uuid.jpg"
}
```

### Upload Multiple Images
```
POST /upload/multiple

Headers:
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

Body:
{
  "files": [<file1>, <file2>]
}

Response: 201 Created
[
  { "filename": "...", "url": "..." },
  { "filename": "...", "url": "..." }
]
```

---

## 📊 Specifications

### Get Category Spec Templates
```
GET /categories/:categoryId/spec-templates

Response: 200 OK
[
  {
    "templateId": 1,
    "specName": "Màn hình",
    "specKey": "screen",
    "specType": "select",
    "specOptions": ["6.1 inch", "6.7 inch"],
    "isFilterable": true
  }
]
```

### Create Spec Template (Admin)
```
POST /categories/:categoryId/spec-templates

Headers:
Authorization: Bearer {accessToken}

Body:
{
  "specName": "Màn hình",
  "specKey": "screen",
  "specType": "select",
  "specOptions": ["6.1 inch", "6.7 inch"],
  "isFilterable": true,
  "isVariantOption": false
}

Response: 201 Created
{ ... template data ... }
```

### Save Product Specifications
```
POST /products/:productId/specifications

Headers:
Authorization: Bearer {accessToken}

Body:
[
  {
    "templateId": 1,
    "specKey": "screen",
    "specName": "Màn hình",
    "specValue": "6.7 inch"
  },
  {
    "templateId": 2,
    "specKey": "cpu",
    "specName": "CPU",
    "specValue": "A17 Pro"
  }
]

Response: 201 Created
[ ... saved specs ... ]
```

### Get Product Specifications
```
GET /products/:productId/specifications

Response: 200 OK
[
  {
    "specId": 1,
    "specName": "Màn hình",
    "specValue": "6.7 inch",
    "specGroup": "Display"
  }
]
```

---

## 🏠 Addresses

### Get User Addresses
```
GET /users/addresses

Headers:
Authorization: Bearer {accessToken}

Response: 200 OK
[ ... addresses ... ]
```

### Create Address
```
POST /addresses

Headers:
Authorization: Bearer {accessToken}

Body:
{
  "recipientName": "John Doe",
  "phone": "0901234567",
  "addressLine": "123 Main Street",
  "ward": "Ward 1",
  "district": "District 1",
  "city": "Ho Chi Minh",
  "postalCode": "70000",
  "isDefault": true
}

Response: 201 Created
{ ... address data ... }
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email must be valid"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized - Invalid token"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden - You don't have permission"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Product not found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- Prices are in Vietnamese Đồng (VND)
- Authorization header format: `Authorization: Bearer {accessToken}`
- Rate limiting: 100 requests per minute per IP
- File upload max size: 10MB
- Allowed image formats: JPEG, PNG, GIF, WebP

---

**Last Updated**: December 2024
