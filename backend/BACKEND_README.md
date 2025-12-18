# Arad Agricultural E-commerce - Backend API

Complete REST API for the Arad Agricultural E-commerce Platform built with Node.js, Express, TypeScript, and PostgreSQL.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Setup database
npm run prisma:generate
npm run prisma:migrate

# Seed sample data
npm run prisma:seed

# Start development server
npm run dev
```

Server runs on `http://localhost:3000`
API Documentation: `http://localhost:3000/api-docs`

## 📚 API Documentation

### Swagger UI
Navigate to `http://localhost:3000/api-docs` for interactive API documentation.

### Authentication
All protected endpoints require Bearer token:
```
Authorization: Bearer <jwt_token>
```

## 🔐 Authentication Endpoints

### Register User
```
POST /api/auth/register
Body: {
  "email": "user@example.com",
  "name": "John Doe",
  "password": "SecurePass123"
}
Response: { user, token, refreshToken }
```

### Login
```
POST /api/auth/login
Body: {
  "email": "user@example.com",
  "password": "SecurePass123"
}
Response: { user, token, refreshToken }
```

### Refresh Token
```
POST /api/auth/refresh
Body: { "refreshToken": "..." }
Response: { token, refreshToken }
```

### Update Profile
```
PUT /api/auth/profile
Headers: Authorization: Bearer <token>
Body: {
  "name": "Updated Name",
  "email": "newemail@example.com"
}
Response: { user }
```

### Change Password
```
POST /api/auth/change-password
Headers: Authorization: Bearer <token>
Body: {
  "oldPassword": "OldPass123",
  "newPassword": "NewPass123"
}
```

### Logout
```
POST /api/auth/logout
Headers: Authorization: Bearer <token>
```

## 📦 Product Endpoints

### List Products
```
GET /api/products?page=1&limit=10&categoryId=&search=&minPrice=&maxPrice=&sortBy=createdAt&sortOrder=desc
Response: { data: [], pagination: {} }
```

### Get Product
```
GET /api/products/:id
Response: { product }
```

### Create Product (Admin)
```
POST /api/products
Headers: Authorization: Bearer <admin_token>
Body: {
  "title": "Product Name",
  "description": "...",
  "price": 99.99,
  "categoryId": "...",
  "stock": 50,
  "unit": "kg",
  "images": [],
  "attributes": {}
}
Response: { product }
```

### Update Product (Admin)
```
PUT /api/products/:id
Headers: Authorization: Bearer <admin_token>
Body: { updated fields }
Response: { product }
```

### Delete Product (Admin)
```
DELETE /api/products/:id
Headers: Authorization: Bearer <admin_token>
```

### Add Product Image (Admin)
```
POST /api/products/:id/images
Headers: Authorization: Bearer <admin_token>
Body: { "imageUrl": "https://..." }
Response: { product }
```

### Remove Product Image (Admin)
```
DELETE /api/products/:id/images
Headers: Authorization: Bearer <admin_token>
Body: { "imageUrl": "https://..." }
Response: { product }
```

## 🏷️ Category Endpoints

### List Categories
```
GET /api/categories?parentId=
Response: { categories }
```

### Get Category Tree
```
GET /api/categories/tree
Response: { category tree }
```

### Get Category
```
GET /api/categories/:id
Response: { category }
```

### Create Category (Admin)
```
POST /api/categories
Headers: Authorization: Bearer <admin_token>
Body: {
  "name": "Category Name",
  "parentId": "optional",
  "description": "...",
  "image": "url"
}
Response: { category }
```

### Update Category (Admin)
```
PUT /api/categories/:id
Headers: Authorization: Bearer <admin_token>
Body: { updated fields }
Response: { category }
```

### Delete Category (Admin)
```
DELETE /api/categories/:id
Headers: Authorization: Bearer <admin_token>
```

## 🛒 Cart Endpoints

### Get Cart
```
GET /api/cart?guestToken=optional
Response: { cart with items }
```

### Add to Cart
```
POST /api/cart/:cartId/items
Body: {
  "productId": "...",
  "quantity": 2
}
Response: { cartItem }
```

### Update Cart Item
```
PUT /api/cart/items/:itemId
Body: { "quantity": 3 }
Response: { cartItem }
```

### Remove from Cart
```
DELETE /api/cart/items/:itemId
Response: { success }
```

### Get Cart Total
```
GET /api/cart/:cartId/total
Response: { cart, total, itemCount, items }
```

### Clear Cart
```
POST /api/cart/:cartId/clear
Response: { success }
```

### Merge Guest Cart to User Cart
```
POST /api/cart/merge
Headers: Authorization: Bearer <token>
Body: { "guestToken": "..." }
Response: { merged cart }
```

## 📋 Order Endpoints

### Create Order
```
POST /api/orders
Headers: Authorization: Bearer <token>
Body: { "cartId": "..." }
Response: { order }
```

### Get My Orders
```
GET /api/orders/my?page=1&limit=10
Headers: Authorization: Bearer <token>
Response: { orders, pagination }
```

### Get Order Details
```
GET /api/orders/:id
Headers: Authorization: Bearer <token>
Response: { order with items }
```

### Get All Orders (Admin)
```
GET /api/orders/admin/all?page=1&limit=10&status=PENDING
Headers: Authorization: Bearer <admin_token>
Response: { orders, pagination }
```

### Update Order Status (Admin)
```
PUT /api/orders/:id
Headers: Authorization: Bearer <admin_token>
Body: { "status": "PROCESSING" }
Response: { order }
```

Status values: PENDING, PROCESSING, COMPLETED, CANCELLED

### Cancel Order (Admin)
```
DELETE /api/orders/:id
Headers: Authorization: Bearer <admin_token>
Response: { order }
```

## 📧 Contact Form Endpoints

### Submit Contact Form
```
POST /api/contact
Body: {
  "name": "John",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "..."
}
Response: { submission }
```

### Get Submissions (Admin)
```
GET /api/contact?page=1&limit=10&read=false
Headers: Authorization: Bearer <admin_token>
Response: { submissions, pagination }
```

### Get Submission (Admin)
```
GET /api/contact/:id
Headers: Authorization: Bearer <admin_token>
Response: { submission (marks as read) }
```

### Delete Submission (Admin)
```
DELETE /api/contact/:id
Headers: Authorization: Bearer <admin_token>
```

## 🔧 Service Endpoints

### List Services
```
GET /api/services?type=GREENHOUSE
Response: { services }
```

### Get Service
```
GET /api/services/:id
Response: { service }
```

### Create Service (Admin)
```
POST /api/services
Headers: Authorization: Bearer <admin_token>
Body: {
  "title": "Service Name",
  "type": "GREENHOUSE|AGRICULTURAL_STRUCTURE|LANDSCAPING_VILLA|LEGAL_CONSULTATION|AI_AGRICULTURE",
  "description": "...",
  "image": "url"
}
Response: { service }
```

### Update Service (Admin)
```
PUT /api/services/:id
Headers: Authorization: Bearer <admin_token>
Body: { updated fields }
Response: { service }
```

### Delete Service (Admin)
```
DELETE /api/services/:id
Headers: Authorization: Bearer <admin_token>
```

## 📁 Media Upload Endpoints

### Get Media Files (Admin)
```
GET /api/media?page=1&limit=20
Headers: Authorization: Bearer <admin_token>
Response: { files, pagination }
```

### Get Media File
```
GET /api/media/:id
Response: { file }
```

### Upload Media File (Admin)
```
POST /api/media
Headers: Authorization: Bearer <admin_token>
Body: FormData with 'file' field
Response: { mediaFile }
```

### Delete Media File (Admin)
```
DELETE /api/media/:id
Headers: Authorization: Bearer <admin_token>
```

## 🗄️ Database Schema

### User
```typescript
id: String (cuid)
email: String (unique)
name: String
passwordHash: String
role: ADMIN | STAFF | CUSTOMER
createdAt: DateTime
updatedAt: DateTime
```

### Category
```typescript
id: String (cuid)
name: String
slug: String (unique)
description: String?
image: String?
parentId: String? (self-referencing)
children: Category[]
products: Product[]
createdAt: DateTime
updatedAt: DateTime
```

### Product
```typescript
id: String (cuid)
title: String
slug: String (unique)
description: String
price: Float
stock: Int
unit: String
images: String[]
attributes: JSON?
categoryId: String
category: Category
cartItems: CartItem[]
orderItems: OrderItem[]
createdAt: DateTime
updatedAt: DateTime
```

### Cart
```typescript
id: String (cuid)
userId: String?
guestToken: String? (unique)
user: User?
items: CartItem[]
createdAt: DateTime
updatedAt: DateTime
```

### CartItem
```typescript
id: String (cuid)
cartId: String
productId: String
quantity: Int
cart: Cart
product: Product
createdAt: DateTime
updatedAt: DateTime
```

### Order
```typescript
id: String (cuid)
userId: String
totalAmount: Float
status: PENDING | PROCESSING | COMPLETED | CANCELLED
user: User
items: OrderItem[]
createdAt: DateTime
updatedAt: DateTime
```

### OrderItem
```typescript
id: String (cuid)
orderId: String
productId: String
quantity: Int
price: Float
order: Order
product: Product
createdAt: DateTime
```

### ContactSubmission
```typescript
id: String (cuid)
name: String
email: String
phone: String
message: String
read: Boolean
createdAt: DateTime
```

### Service
```typescript
id: String (cuid)
title: String
type: GREENHOUSE | AGRICULTURAL_STRUCTURE | LANDSCAPING_VILLA | LEGAL_CONSULTATION | AI_AGRICULTURE
description: String
image: String?
createdAt: DateTime
updatedAt: DateTime
```

### MediaFile
```typescript
id: String (cuid)
filename: String
url: String
mimeType: String
size: Int
createdAt: DateTime
```

## 🔒 Authorization

### Role-Based Access Control
- **ADMIN**: Full access to all endpoints
- **STAFF**: Access to read-only and management endpoints (limited)
- **CUSTOMER**: Access to product browsing, cart, and order endpoints

### Protected Routes Middleware
```typescript
authMiddleware      // Requires valid JWT token
roleMiddleware      // Checks user role
adminOnly          // Requires ADMIN role
staffOrAdmin       // Requires ADMIN or STAFF role
```

## 🛡️ Error Handling

All errors follow consistent format:
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

### HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

## 📝 Input Validation

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number

### Email Validation
Standard email format validation

### File Upload
- Maximum size: 50MB
- Allowed types: image/jpeg, image/png, image/gif, image/webp

## 🚀 Production Deployment

### Build
```bash
npm run build
```

### Start
```bash
npm start
```

### Environment Setup
Set all environment variables on your hosting platform:
- DATABASE_URL
- JWT_SECRET
- JWT_REFRESH_SECRET
- CORS_ORIGIN
- NODE_ENV=production

### Database Migrations
```bash
npm run prisma:migrate
```

## 🔍 Project Structure

```
src/
├── modules/
│   ├── auth/          # Authentication
│   ├── users/         # User management
│   ├── products/      # Products CRUD
│   ├── categories/    # Categories management
│   ├── cart/          # Shopping cart
│   ├── orders/        # Orders management
│   ├── services/      # Services CRUD
│   ├── contact/       # Contact form
│   └── media/         # File uploads
├── core/
│   ├── middleware/    # Auth & error handling
│   ├── utils/         # Helpers & utilities
│   └── config/        # Configuration
├── database/
│   └── prisma/        # Prisma schema
├── app.ts            # Express setup
└── index.ts          # Server entry point
```

## 📦 Dependencies

- **express**: Web framework
- **typescript**: Type safety
- **@prisma/client**: ORM
- **jsonwebtoken**: JWT auth
- **bcryptjs**: Password hashing
- **cors**: Cross-origin support
- **multer**: File uploads
- **swagger-jsdoc**: API docs generation

## 📞 Support

For issues or questions, please refer to the API documentation or open an issue on the repository.

---

**Built with ❤️ for Arad Agricultural E-commerce Platform**
