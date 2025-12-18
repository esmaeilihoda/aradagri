# Arad Agricultural E-commerce Platform - Architecture & Design Guide

Comprehensive guide to the architecture, design patterns, and system design of the platform.

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React Admin)                   │
│                    (Vite + TypeScript)                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Components, Pages, Hooks, Services                    │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST API
                     │ (Axios + JWT)
┌────────────────────▼────────────────────────────────────────┐
│                Backend (Express.js)                          │
│            (Node.js + TypeScript)                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Routes → Controllers → Services → Database            │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │ SQL
                     │
┌────────────────────▼────────────────────────────────────────┐
│            Database (PostgreSQL)                             │
│            (Managed by Prisma ORM)                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Users, Products, Orders, Categories, etc.            │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

## 🔄 Request Flow

### Authentication Request Flow

```
User Input (Email/Password)
         ↓
[LoginPage.tsx] validates input
         ↓
[API Client] POST /api/auth/login
         ↓
[Backend Express] routes to auth.controller.ts
         ↓
[auth.service.ts] validates credentials, generates tokens
         ↓
[PostgreSQL] queries user
         ↓
[JWT Utility] signs access & refresh tokens
         ↓
Response with tokens
         ↓
[useAuth Hook] stores tokens in localStorage
         ↓
Redirect to Dashboard
```

### API Request with Authentication

```
Component wants data
         ↓
[Custom Hook] (e.g., useProducts)
         ↓
[React Query] manages cache & request
         ↓
[API Client] adds Authorization header
         ↓
[Axios Interceptor] includes JWT token
         ↓
[Backend Express] verifies token middleware
         ↓
[auth.middleware.ts] extracts user from token
         ↓
[Route Handler] processes request
         ↓
[Service Layer] executes business logic
         ↓
[Prisma] queries database
         ↓
[PostgreSQL] executes SQL
         ↓
Response with data
         ↓
[Axios Interceptor] handles response/errors
         ↓
[React Query] updates cache
         ↓
Component re-renders with new data
```

## 🏛️ Backend Architecture

### Layered Architecture

```
┌─────────────────────────────────────────┐
│           Routes Layer                   │
│  (Express Router, Path Definitions)     │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│        Middleware Layer                  │
│  (Auth, Error Handling, Validation)     │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│       Controller Layer                   │
│  (HTTP Request/Response Handling)       │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│        Service Layer                     │
│  (Business Logic, Validation)           │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│     Data Access Layer (Prisma)          │
│  (Database Queries, ORM)                │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│        Database Layer                    │
│  (PostgreSQL)                           │
└─────────────────────────────────────────┘
```

### Module Structure

Each feature module has a consistent structure:

```
src/modules/[feature]/
├── [feature].service.ts     # Business logic
├── [feature].controller.ts  # HTTP handlers
├── [feature].routes.ts      # Route definitions
└── [feature].types.ts       # TypeScript types (optional)
```

**Example - Products Module:**

```
src/modules/products/
├── product.service.ts       # CRUD, filtering, pagination logic
├── product.controller.ts    # GET, POST, PUT, DELETE handlers
├── product.routes.ts        # Route definitions with Swagger docs
└── (Shared types in src/types/)
```

### Service Layer Pattern

```typescript
// product.service.ts - Business Logic
export class ProductService {
  // CRUD Operations
  async createProduct(data) { ... }
  async getProduct(id) { ... }
  async updateProduct(id, data) { ... }
  async deleteProduct(id) { ... }
  
  // Domain Logic
  async getProductsByCategory(categoryId) { ... }
  async searchProducts(query) { ... }
  async applyFilters(filters) { ... }
  
  // Data Transformation
  async calculatePriceWithTax(price) { ... }
  async enrichProductData(product) { ... }
}
```

### Controller Pattern

```typescript
// product.controller.ts - HTTP Handlers
export class ProductController {
  // All handlers wrapped with asyncHandler
  // for automatic error handling
  
  async getProducts(req, res) {
    const products = await productService.getProducts(...);
    res.json({ success: true, data: products });
  }
  
  async createProduct(req, res) {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ success: true, data: product });
  }
}
```

### Error Handling Pattern

```typescript
// Custom Error Classes
class ApiError extends Error {
  constructor(status, message) {
    this.status = status;
    this.message = message;
  }
}

// Usage in Service
async createProduct(data) {
  if (!data.title) {
    throw new ApiError(400, 'Title is required');
  }
  // ...
}

// Middleware catches and responds
const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message
  });
};
```

## 🗄️ Database Architecture

### Entity Relationship Diagram

```
User (1) ──────→ (N) Cart
  │                  │
  │ (1)              │ (N)
  │                  │
  └──→ CartItem ←────┘
       │
       └──→ (N) Product (1)
            │
            └──→ (1) Category

User (1) ──────→ (N) Order
  │
  └──→ (N) OrderItem
       │
       └──→ (1) Product

User (1) ──────→ (N) ContactSubmission
Category (1) ──→ (N) Product
Service (1) ──→ (N) [None - Standalone]
MediaFile (1) ──→ Product Images
```

### Schema Design Principles

1. **Normalization**: No redundant data except for performance
2. **Relationships**: Foreign keys maintain referential integrity
3. **Enums**: Use for limited sets of values (Role, OrderStatus)
4. **Timestamps**: Track creation and updates
5. **Soft Deletes**: Consider for important entities

### Key Models

```typescript
// User - Authentication & Authorization
model User {
  id String
  email String (unique)
  password String (hashed)
  firstName String
  lastName String
  role Role (ADMIN, STAFF, CUSTOMER)
  cart Cart?
  orders Order[]
  contactSubmissions ContactSubmission[]
}

// Product - Core E-commerce Entity
model Product {
  id String
  title String
  slug String
  description String
  price Decimal
  stock Int
  category Category
  images String[] (array of URLs)
  attributes Json (flexible attributes)
  createdAt DateTime
}

// Cart - Shopping Cart
model Cart {
  id String
  user User?
  guestToken String? (for guest users)
  items CartItem[]
}

// Order - Purchase Record
model Order {
  id String
  user User
  orderNumber String (unique, readable format)
  status OrderStatus
  items OrderItem[]
  shippingAddress String
  total Decimal
}
```

## 🔐 Security Architecture

### Authentication Flow

```
1. Registration
   User provides email & password
       ↓
   Password hashed with bcryptjs (10 rounds)
       ↓
   User stored in database
       ↓
   Return user (without password)

2. Login
   User provides credentials
       ↓
   Fetch user by email
       ↓
   Compare password with hash (bcryptjs)
       ↓
   Generate Access Token (JWT, 7 days)
       ↓
   Generate Refresh Token (JWT, 30 days)
       ↓
   Return both tokens

3. Protected Request
   Client includes: Authorization: Bearer <accessToken>
       ↓
   Middleware verifies token signature
       ↓
   Extract userId from token payload
       ↓
   Attach user to request object
       ↓
   Proceed to route handler

4. Token Refresh
   Client provides: refreshToken
       ↓
   Verify refresh token
       ↓
   Check user still exists
       ↓
   Generate new access token
       ↓
   Return new tokens
```

### Authorization Pattern

```typescript
// Role-Based Middleware
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    throw new ForbiddenError('Admin access required');
  }
  next();
};

// Usage
router.delete('/products/:id', adminOnly, deleteProduct);

// Decorator Pattern
@adminOnly
async deleteProduct(req, res) { ... }
```

### Password Security

```typescript
// Hashing on registration/password change
const hashedPassword = await bcryptjs.hash(plainPassword, 10);

// Verification on login
const isValid = await bcryptjs.compare(plainPassword, hashedPassword);

// Never store plain passwords
// Never return password in API responses
```

## 🎨 Frontend Architecture

### State Management Pattern

```
Local State          Global State (Context/Storage)
  ↓                           ↓
useForm (form data) ← useAuth (user, tokens)
useModal (UI)                 ↓
                        localStorage (persistence)
```

### Data Fetching Pattern

```
Component
    ↓
useQuery Hook (React Query)
    ↓
API Client (Axios)
    ↓
Interceptors (Add Auth Header)
    ↓
Backend API
    ↓
Response
    ↓
React Query Cache
    ↓
Component Re-render
```

### Component Architecture

```
Pages (Route Components)
    ├── Dashboard
    ├── Products
    ├── Categories
    ├── Orders
    └── Contact

    ↓ (Use Custom Hooks)

Custom Hooks
    ├── useAuth
    ├── useProducts
    ├── useCategories
    ├── useOrders
    └── useContact

    ↓ (Call API Methods)

API Client (Axios)
    ├── login/logout
    ├── CRUD products
    ├── CRUD categories
    └── ...

    ↓ (Make HTTP Requests)

Backend API
```

### Protected Route Pattern

```typescript
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>

↓

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
}
```

## 🔄 Data Flow Examples

### Creating a Product (Happy Path)

```
1. Admin enters product details in form
2. Clicks "Create Product"
3. useCreateProduct hook mutation fires
4. API Client makes POST /api/products
5. Backend validates input
6. Service layer checks permissions
7. Product saved to database
8. Prisma returns created product
9. Response with 201 status
10. React Query invalidates products cache
11. Products list refetches automatically
12. Admin sees new product in table
13. Success notification shown
```

### Adding Item to Cart

```
1. Customer clicks "Add to Cart"
2. Component calls useAddToCart mutation
3. Check if user authenticated
   a. If yes: use user's cart
   b. If no: create/use guest cart with token
4. API POST /api/cart/add with productId & quantity
5. Backend service:
   a. Get or create cart for user/guest
   b. Check product exists and has stock
   c. Create or update CartItem
   d. Return updated cart
6. React Query updates cart cache
7. Cart item count badge updates
8. Success message shown
```

### Placing Order

```
1. Customer reviews cart
2. Clicks "Place Order"
3. Enters shipping address
4. useCreateOrder mutation fires
5. API POST /api/orders with items & address
6. Backend service:
   a. Validates cart items still in stock
   b. Creates Order record
   c. Creates OrderItem for each CartItem
   d. Decrements product stock for each item
   e. Clears user's cart
   f. Generates order number (ORD-YYYYMMDD-0001)
   g. Returns order details
7. React Query updates orders cache
8. Cart cache cleared/invalidated
9. Redirect to order confirmation
```

## 🎯 Design Patterns Used

### 1. Service-Controller-Route Pattern
- **Service**: Business logic and data access
- **Controller**: HTTP request/response handling
- **Route**: API endpoint definitions

### 2. Middleware Pattern
- Authentication middleware
- Error handling middleware
- CORS, logging middleware

### 3. Factory Pattern
- Prisma client singleton
- JWT token creation

### 4. Repository Pattern
- Data access through Prisma (ORM)
- Abstraction of database operations

### 5. Observer Pattern
- React Query subscriptions
- Component re-renders on data changes

### 6. Strategy Pattern
- Multiple error handling strategies
- Different authentication methods (JWT)

### 7. Decorator Pattern
- adminOnly, staffOrAdmin decorators
- asyncHandler wrapper

## 📊 Caching Strategy

### React Query Caching

```typescript
// Automatic cache management
const { data, isLoading } = useQuery({
  queryKey: ['products', page], // Cache key
  queryFn: () => fetchProducts(page),
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
});

// Manual invalidation on mutations
const mutation = useMutation({
  mutationFn: createProduct,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  },
});
```

### Backend Caching Opportunities

1. Product listings (products with same filters)
2. Category tree (relatively static)
3. Services data (rarely changes)
4. User profile (per-user cache)

## 🚀 Performance Considerations

### Backend Performance
1. **Database Indexing**: Index frequently queried fields
2. **Pagination**: Always paginate large datasets
3. **Connection Pooling**: Reuse database connections
4. **Query Optimization**: Minimize N+1 queries
5. **Compression**: gzip responses

### Frontend Performance
1. **Code Splitting**: Lazy load pages
2. **Image Optimization**: Resize and compress images
3. **Caching**: React Query + localStorage
4. **Memoization**: useMemo, useCallback for expensive operations
5. **Bundle Size**: Monitor and optimize imports

### Database Performance
1. **Normalization**: Proper schema design
2. **Indexing**: On foreign keys and frequently searched fields
3. **Query Planning**: Use EXPLAIN ANALYZE
4. **Vacuum**: Regular maintenance

## 🔧 Extension Points

### Adding New Feature

1. **Database**: Add model to `prisma/schema.prisma`
2. **Backend**: Create service, controller, routes
3. **API**: Add endpoints with error handling
4. **Frontend**: Create hook, page, components
5. **Admin**: Add navigation and CRUD UI

### Adding New Page

```typescript
// 1. Create page component
src/pages/NewPage.tsx

// 2. Create custom hook
src/hooks/useNewFeature.ts

// 3. Add route
App.tsx: <Route path="/new" element={<ProtectedRoute><NewPage/></ProtectedRoute>} />

// 4. Add sidebar link
Sidebar.tsx: <SidebarLink to="/new" label="New Feature" />
```

## 📈 Scalability Considerations

### Database
- Use read replicas for scaling reads
- Implement sharding for very large datasets
- Archive old orders/contact data
- Optimize queries with proper indexing

### Backend
- Horizontal scaling with load balancer
- Queue system for background jobs
- Caching layer (Redis)
- API rate limiting
- CDN for static assets

### Frontend
- Server-side rendering for SEO
- Progressive loading
- Service workers for offline support
- Optimize bundle size

## 🧪 Testing Strategy

### Backend Testing
```typescript
// Unit tests for services
// Integration tests for API endpoints
// Database tests with test database
// Authentication/Authorization tests
```

### Frontend Testing
```typescript
// Component unit tests
// Hook testing
// Integration tests for pages
// E2E tests for user flows
```

## 📚 Documentation Standards

All code includes:
- JSDoc comments for functions
- TypeScript types for all parameters
- README files for modules
- Swagger documentation for APIs
- Architecture decisions documented

## 🎓 Learning Resources

- Express.js patterns
- PostgreSQL optimization
- React Query advanced patterns
- TypeScript best practices
- REST API design principles

---

**Last Updated:** January 2024
**Version:** 1.0.0
