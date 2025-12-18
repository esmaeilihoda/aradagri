# Arad Agricultural E-commerce - API Endpoints Reference

Quick reference for all API endpoints with examples and response formats.

## 📡 Base URL

```
http://localhost:3000/api
```

## 🔑 Authentication

All protected endpoints require:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📚 API Endpoints by Module

---

## 🔐 Authentication Module

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password@123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER"
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password@123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "CUSTOMER"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### Refresh Access Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_token",
    "refreshToken": "new_refresh_token"
  }
}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### Get User Profile
```http
GET /auth/profile
Authorization: Bearer JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Update Profile
```http
PUT /auth/profile
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+98912345678",
  "address": "123 Main St"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "+98912345678",
    "address": "123 Main St"
  }
}
```

### Change Password
```http
POST /auth/change-password
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "oldPassword": "OldPassword@123",
  "newPassword": "NewPassword@123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 📦 Products Module

### Get All Products
```http
GET /products?page=1&limit=10&categoryId=uuid&search=tomato&minPrice=0&maxPrice=100&sortBy=createdAt&sortOrder=DESC
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `categoryId`: Filter by category UUID (optional)
- `search`: Search by title/description (optional)
- `minPrice`: Minimum price filter (optional)
- `maxPrice`: Maximum price filter (optional)
- `sortBy`: Field to sort by (default: createdAt)
- `sortOrder`: ASC or DESC (default: DESC)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Organic Tomatoes",
      "description": "Fresh organic tomatoes",
      "price": 12.99,
      "stock": 100,
      "categoryId": "uuid",
      "images": ["url1", "url2"],
      "attributes": {
        "weight": "1kg",
        "origin": "Iran"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

### Get Product by ID
```http
GET /products/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Organic Tomatoes",
    "description": "Fresh organic tomatoes",
    "price": 12.99,
    "stock": 100,
    "categoryId": "uuid",
    "images": ["url1", "url2"],
    "attributes": {
      "weight": "1kg",
      "origin": "Iran"
    }
  }
}
```

### Create Product (Admin/Staff)
```http
POST /products
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "title": "Organic Tomatoes",
  "description": "Fresh organic tomatoes from local farmers",
  "price": 12.99,
  "stock": 100,
  "categoryId": "uuid",
  "images": ["https://example.com/image.jpg"],
  "attributes": {
    "weight": "1kg",
    "origin": "Iran",
    "organic": true
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "uuid",
    "title": "Organic Tomatoes",
    "slug": "organic-tomatoes",
    "price": 12.99,
    "stock": 100
  }
}
```

### Update Product (Admin/Staff)
```http
PUT /products/:id
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "title": "Fresh Organic Tomatoes",
  "price": 13.99,
  "stock": 80
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Fresh Organic Tomatoes",
    "price": 13.99,
    "stock": 80
  }
}
```

### Delete Product (Admin)
```http
DELETE /products/:id
Authorization: Bearer JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### Add Product Image (Admin/Staff)
```http
POST /products/:id/images
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "images": ["url1", "url2", "url3"]
  }
}
```

### Remove Product Image (Admin/Staff)
```http
DELETE /products/:id/images/:imageUrl
Authorization: Bearer JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "images": ["url1", "url2"]
  }
}
```

---

## 🏷️ Categories Module

### Get All Categories
```http
GET /categories
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Vegetables",
      "description": "Fresh vegetables",
      "slug": "vegetables",
      "parentId": null,
      "children": [
        {
          "id": "uuid2",
          "name": "Leafy Greens",
          "parentId": "uuid"
        }
      ]
    }
  ]
}
```

### Get Category Tree
```http
GET /categories/tree
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Vegetables",
      "description": "Fresh vegetables",
      "children": [
        {
          "id": "uuid2",
          "name": "Leafy Greens",
          "children": []
        }
      ]
    }
  ]
}
```

### Get Category by ID
```http
GET /categories/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Vegetables",
    "description": "Fresh vegetables",
    "parentId": null,
    "products": [...]
  }
}
```

### Create Category (Admin)
```http
POST /categories
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "name": "Vegetables",
  "description": "Fresh vegetables from local farms",
  "parentId": null
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Vegetables",
    "slug": "vegetables"
  }
}
```

### Update Category (Admin)
```http
PUT /categories/:id
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "name": "Fresh Vegetables",
  "description": "Organic vegetables"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Fresh Vegetables"
  }
}
```

### Delete Category (Admin)
```http
DELETE /categories/:id
Authorization: Bearer JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

## 🛒 Cart Module

### Get or Create Cart
```http
GET /cart
Authorization: Bearer JWT_TOKEN (optional for guests)
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "items": [
      {
        "id": "uuid",
        "productId": "uuid",
        "quantity": 2,
        "product": {
          "id": "uuid",
          "title": "Organic Tomatoes",
          "price": 12.99,
          "images": []
        }
      }
    ],
    "total": 25.98,
    "itemCount": 2
  }
}
```

### Add to Cart
```http
POST /cart/add
Authorization: Bearer JWT_TOKEN (optional)
Content-Type: application/json

{
  "productId": "uuid",
  "quantity": 2
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "cartId": "uuid",
    "cartItem": {
      "id": "uuid",
      "quantity": 2,
      "product": {...}
    }
  }
}
```

### Update Cart Item
```http
PUT /cart/items/:itemId
Authorization: Bearer JWT_TOKEN (optional)
Content-Type: application/json

{
  "quantity": 5
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "quantity": 5
  }
}
```

### Remove from Cart
```http
DELETE /cart/items/:itemId
Authorization: Bearer JWT_TOKEN (optional)
```

**Response (200):**
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

### Clear Cart
```http
DELETE /cart
Authorization: Bearer JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cart cleared"
}
```

### Merge Guest Cart
```http
POST /cart/merge
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "guestCartId": "uuid"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Carts merged successfully",
  "data": {
    "cartId": "uuid",
    "items": [...]
  }
}
```

---

## 📦 Orders Module

### Create Order from Cart
```http
POST /orders
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "shippingAddress": "123 Main St, City, Country",
  "notes": "Please deliver in the morning"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": "uuid",
    "orderNumber": "ORD-20240101-0001",
    "userId": "uuid",
    "status": "PENDING",
    "items": [...],
    "total": 100.00,
    "shippingAddress": "123 Main St, City, Country",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Get User Orders
```http
GET /orders?page=1&limit=10&status=PENDING
Authorization: Bearer JWT_TOKEN
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status (PENDING, PROCESSING, COMPLETED, CANCELLED)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "orderNumber": "ORD-20240101-0001",
      "status": "PENDING",
      "total": 100.00,
      "items": [...],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5
  }
}
```

### Get Order by ID
```http
GET /orders/:id
Authorization: Bearer JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "ORD-20240101-0001",
    "userId": "uuid",
    "status": "PENDING",
    "items": [
      {
        "id": "uuid",
        "productId": "uuid",
        "quantity": 2,
        "price": 12.99,
        "product": {...}
      }
    ],
    "shippingAddress": "123 Main St",
    "total": 25.98,
    "notes": "Please deliver in the morning",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Update Order Status (Admin)
```http
PUT /admin/orders/:id/status
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "status": "PROCESSING"
}
```

**Valid Statuses:** PENDING, PROCESSING, COMPLETED, CANCELLED

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "PROCESSING"
  }
}
```

### Cancel Order
```http
PUT /orders/:id/cancel
Authorization: Bearer JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

### Get All Orders (Admin)
```http
GET /admin/orders?page=1&limit=10&status=PENDING
Authorization: Bearer JWT_TOKEN (Admin only)
```

**Response (200):**
```json
{
  "success": true,
  "data": [...]
}
```

---

## 📞 Contact Module

### Submit Contact Form
```http
POST /contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Greenhouse Inquiry",
  "message": "I'm interested in your greenhouse structures",
  "phone": "+98912345678"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Contact submission received. We'll get back to you soon.",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Get Contact Submissions (Admin)
```http
GET /contact?page=1&limit=10&read=false
Authorization: Bearer JWT_TOKEN (Admin only)
```

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `read`: Filter by read status (true/false)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "subject": "Greenhouse Inquiry",
      "message": "I'm interested in your greenhouse structures",
      "phone": "+98912345678",
      "isRead": false,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {...}
}
```

### Get Contact Submission by ID (Admin)
```http
GET /contact/:id
Authorization: Bearer JWT_TOKEN (Admin only)
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Greenhouse Inquiry",
    "message": "Full message content",
    "phone": "+98912345678",
    "isRead": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Delete Contact Submission (Admin)
```http
DELETE /contact/:id
Authorization: Bearer JWT_TOKEN (Admin only)
```

**Response (200):**
```json
{
  "success": true,
  "message": "Contact submission deleted"
}
```

---

## 🔧 Services Module

### Get All Services
```http
GET /services?type=GREENHOUSE&page=1&limit=10
```

**Query Parameters:**
- `type`: Service type (GREENHOUSE, AGRICULTURAL_STRUCTURE, LANDSCAPING, LEGAL, AI_CONSULTING)
- `page`: Page number
- `limit`: Items per page

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Greenhouse Design & Installation",
      "description": "Professional greenhouse design and installation services",
      "type": "GREENHOUSE",
      "features": ["Design Consultation", "Installation", "Maintenance"],
      "price": 5000,
      "image": "https://example.com/image.jpg"
    }
  ],
  "pagination": {...}
}
```

### Get Service by ID
```http
GET /services/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Greenhouse Design & Installation",
    "description": "Professional greenhouse design and installation services",
    "type": "GREENHOUSE",
    "features": ["Design Consultation", "Installation", "Maintenance"],
    "price": 5000,
    "image": "https://example.com/image.jpg",
    "detailedDescription": "Full service details",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Create Service (Admin)
```http
POST /services
Authorization: Bearer JWT_TOKEN (Admin only)
Content-Type: application/json

{
  "title": "Greenhouse Design & Installation",
  "description": "Professional greenhouse design and installation services",
  "detailedDescription": "Full service details",
  "type": "GREENHOUSE",
  "price": 5000,
  "image": "https://example.com/image.jpg",
  "features": ["Design Consultation", "Installation", "Maintenance"]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Greenhouse Design & Installation"
  }
}
```

### Update Service (Admin)
```http
PUT /services/:id
Authorization: Bearer JWT_TOKEN (Admin only)
Content-Type: application/json

{
  "title": "Premium Greenhouse Design & Installation",
  "price": 6000
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Premium Greenhouse Design & Installation"
  }
}
```

### Delete Service (Admin)
```http
DELETE /services/:id
Authorization: Bearer JWT_TOKEN (Admin only)
```

**Response (200):**
```json
{
  "success": true,
  "message": "Service deleted successfully"
}
```

---

## 📸 Media Module

### Upload Media (Admin)
```http
POST /media/upload
Authorization: Bearer JWT_TOKEN (Admin only)
Content-Type: multipart/form-data

file: <binary file data>
category: "products"
```

**Response (201):**
```json
{
  "success": true,
  "message": "Media uploaded successfully",
  "data": {
    "id": "uuid",
    "originalName": "product-image.jpg",
    "filename": "1704067200000-product-image.jpg",
    "path": "/uploads/products/1704067200000-product-image.jpg",
    "mimeType": "image/jpeg",
    "size": 102400,
    "uploadedAt": "2024-01-01T00:00:00Z"
  }
}
```

### Get Media Files
```http
GET /media?page=1&limit=20&category=products
Authorization: Bearer JWT_TOKEN (Admin only)
```

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `category`: Filter by category

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "originalName": "product-image.jpg",
      "filename": "1704067200000-product-image.jpg",
      "path": "/uploads/products/1704067200000-product-image.jpg",
      "mimeType": "image/jpeg",
      "size": 102400,
      "uploadedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {...}
}
```

### Delete Media (Admin)
```http
DELETE /media/:id
Authorization: Bearer JWT_TOKEN (Admin only)
```

**Response (200):**
```json
{
  "success": true,
  "message": "Media deleted successfully"
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid request",
  "errors": [
    "Email is required",
    "Password must be at least 8 characters"
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized access",
  "error": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Forbidden",
  "error": "You do not have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found",
  "error": "Product with id 'uuid' not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Conflict",
  "error": "User with this email already exists"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "An unexpected error occurred"
}
```

---

## 🔐 Role-Based Access Control

| Endpoint | Public | Customer | Staff | Admin |
|----------|--------|----------|-------|-------|
| GET /products | ✅ | ✅ | ✅ | ✅ |
| POST /products | ❌ | ❌ | ✅ | ✅ |
| PUT /products/:id | ❌ | ❌ | ✅ | ✅ |
| DELETE /products/:id | ❌ | ❌ | ❌ | ✅ |
| GET /cart | ✅* | ✅ | ✅ | ✅ |
| POST /cart/add | ✅* | ✅ | ✅ | ✅ |
| POST /orders | ❌ | ✅ | ✅ | ✅ |
| GET /orders | ❌ | ✅* | ✅ | ✅ |
| GET /contact | ❌ | ❌ | ❌ | ✅ |
| POST /contact | ✅ | ✅ | ✅ | ✅ |

\* Guest users with guest token

---

## 📊 API Documentation

Interactive API documentation available at:
```
http://localhost:3000/api-docs
```

Uses Swagger UI for testing endpoints directly.

---

**Last Updated:** January 2024
**Version:** 1.0.0
