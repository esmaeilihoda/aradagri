# Arad Agricultural E-commerce Platform - Developer Quick Reference

Quick reference guide for common development tasks, commands, and patterns.

## 🚀 Quick Start

### First Time Setup (5 minutes)

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npm run prisma:migrate
npm run prisma:seed
npm run dev

# In another terminal - Admin Panel
cd admin
npm install
npm run dev
```

Visit:
- Backend: http://localhost:3000/api-docs
- Admin: http://localhost:3001/login
- Credentials: admin@aradagri.com / Admin@123

## 📋 Command Reference

### Backend Commands

```bash
# Development
npm run dev                    # Start dev server with auto-reload
npm run build                  # Build for production
npm start                      # Start production server
npm run prisma:generate        # Generate Prisma client
npm run prisma:migrate         # Run pending migrations
npm run prisma:migrate:dev     # Create migration in dev mode
npm run prisma:seed            # Seed database with sample data
npm run prisma:studio          # Open Prisma Studio GUI
npm run prisma:db:push         # Push schema to database (dev only)
npm run prisma:db:reset        # Reset database to fresh state
npm run type-check             # Check TypeScript types
npm run lint                   # Lint code (if eslint configured)
```

### Admin Panel Commands

```bash
# Development
npm run dev                    # Start dev server on :3001
npm run build                  # Build for production
npm run preview                # Preview production build locally
npm run type-check             # Check TypeScript types
npm run lint                   # Lint code (if eslint configured)
```

## 🏗️ Project Navigation

### Backend File Structure
```
backend/
├── src/
│   ├── index.ts              # Entry point - START HERE
│   ├── app.ts                # Express setup
│   ├── core/
│   │   ├── config/           # Environment variables
│   │   ├── middleware/       # Auth, errors, validation
│   │   └── utils/            # JWT, password, errors
│   └── modules/              # Features
│       ├── auth/             # Login/register
│       ├── products/         # Products CRUD
│       ├── categories/       # Categories CRUD
│       ├── cart/             # Shopping cart
│       ├── orders/           # Orders
│       ├── contact/          # Contact form
│       ├── services/         # Services
│       └── media/            # File uploads
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Sample data
└── package.json              # Dependencies
```

### Admin Panel Structure
```
admin/
├── src/
│   ├── pages/                # Route pages
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── CategoriesPage.tsx
│   │   ├── OrdersPage.tsx
│   │   └── ContactPage.tsx
│   ├── components/
│   │   └── layout/           # Shared layout
│   ├── hooks/                # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useProducts.ts
│   │   ├── useCategories.ts
│   │   ├── useOrders.ts
│   │   └── useContact.ts
│   ├── services/
│   │   └── api.ts            # API client
│   ├── types/
│   │   └── index.ts          # TypeScript types
│   ├── App.tsx               # Main router
│   └── main.tsx              # Entry point
├── package.json
├── vite.config.ts
└── tailwind.config.ts
```

## 🔐 Authentication Patterns

### Checking User in Backend

```typescript
// In route handler (protected route)
router.get('/profile', authMiddleware, (req, res) => {
  const userId = req.user.id;        // Extracted from JWT
  const userRole = req.user.role;    // ADMIN, STAFF, CUSTOMER
  
  // Handle request with user context
});

// Admin-only endpoint
router.delete('/products/:id', adminOnly, (req, res) => {
  // Only ADMIN role can access
});

// Staff or Admin
router.post('/products', staffOrAdmin, (req, res) => {
  // STAFF and ADMIN roles can access
});
```

### Checking User in Frontend

```typescript
// In component
import { useAuth } from '@/hooks/useAuth';

export function DashboardPage() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return <div>Welcome {user.email}</div>;
}

// Protected route
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

## 🛠️ Common Development Tasks

### Adding a New Endpoint

#### 1. Update Database Schema (if needed)
```typescript
// prisma/schema.prisma
model Product {
  // ... existing fields ...
  newField String?
}
```

Run migration:
```bash
npm run prisma:migrate -- --name add_new_field
npm run prisma:generate
```

#### 2. Create Service Method
```typescript
// src/modules/products/product.service.ts
export class ProductService {
  async updateField(productId: string, newField: string) {
    const product = await prisma.product.update({
      where: { id: productId },
      data: { newField },
    });
    return product;
  }
}
```

#### 3. Create Controller Method
```typescript
// src/modules/products/product.controller.ts
export class ProductController {
  async updateField(req: Request, res: Response) {
    const { id } = req.params;
    const { newField } = req.body;
    
    const product = await productService.updateField(id, newField);
    res.json({ success: true, data: product });
  }
}
```

#### 4. Add Route
```typescript
// src/modules/products/product.routes.ts
router.patch('/:id/field', authMiddleware, 
  asyncHandler(ProductController.updateField));
```

#### 5. Create API Client Method
```typescript
// admin/src/services/api.ts
async updateProductField(id: string, newField: string) {
  const response = await this.axios.patch(`/products/${id}/field`, {
    newField,
  });
  return response.data;
}
```

#### 6. Create Hook
```typescript
// admin/src/hooks/useProducts.ts
export function useUpdateProductField() {
  return useMutation({
    mutationFn: ({ id, newField }) => 
      apiClient.updateProductField(id, newField),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
```

#### 7. Use in Component
```typescript
// admin/src/pages/ProductsPage.tsx
const updateMutation = useUpdateProductField();

async function handleUpdate(id: string, newField: string) {
  await updateMutation.mutateAsync({ id, newField });
}
```

### Creating a New Page

#### 1. Create Page Component
```typescript
// admin/src/pages/NewPage.tsx
export function NewPage() {
  const { data, isLoading } = useNewFeature();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {/* Page content */}
    </div>
  );
}
```

#### 2. Create Custom Hook
```typescript
// admin/src/hooks/useNewFeature.ts
export function useNewFeature() {
  return useQuery({
    queryKey: ['newFeature'],
    queryFn: () => apiClient.getNewFeature(),
  });
}
```

#### 3. Add Route
```typescript
// admin/src/App.tsx
import { NewPage } from '@/pages/NewPage';

<Routes>
  {/* ... existing routes ... */}
  <Route 
    path="/new-feature" 
    element={<ProtectedRoute><NewPage /></ProtectedRoute>} 
  />
</Routes>
```

#### 4. Add Navigation
```typescript
// admin/src/components/layout/Sidebar.tsx
<SidebarLink to="/new-feature" label="New Feature" icon={IconComponent} />
```

## 🐛 Debugging

### Backend Debugging

```typescript
// Use console for quick debugging
console.log('User data:', user);

// Or use VS Code debugger
// Add to .vscode/launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Launch Backend",
  "skipFiles": ["<node_internals>/**"],
  "program": "${workspaceFolder}/backend/src/index.ts",
  "preLaunchTask": "npm: dev"
}

// Or inspect with built-in Node debugger
node --inspect dist/index.js
# Visit chrome://inspect
```

### Frontend Debugging

```typescript
// React DevTools extension
// React Query DevTools

// Console logging
console.log('Component state:', state);

// Debugger statement
debugger; // Pauses when DevTools open

// Network tab
// Check API requests and responses
```

### Database Debugging

```bash
# Open Prisma Studio - Visual database browser
npm run prisma:studio

# View logs
# PostgreSQL logs in /var/log/postgresql/

# Check slow queries
psql -U arad_user -d arad_agri_hub
SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC;
```

## 📊 API Testing

### Using Curl
```bash
# GET request
curl http://localhost:3000/api/products

# POST with JSON
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aradagri.com","password":"Admin@123"}'

# With Authorization header
curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman
1. Import API from `http://localhost:3000/api-docs`
2. Create collection for testing
3. Store token in variable:
   ```
   {{token}}
   ```
4. Add to request headers:
   ```
   Authorization: Bearer {{token}}
   ```

### Using Swagger UI
Visit `http://localhost:3000/api-docs`
- All endpoints documented
- Try out requests directly
- See response schemas

## 🎨 Styling

### Tailwind Classes
```html
<!-- Spacing -->
<div class="p-4 m-2">Padding 1rem, margin 0.5rem</div>

<!-- Colors -->
<div class="bg-green-600 text-white">Green background</div>

<!-- Sizing -->
<div class="w-full h-screen">Full width and height</div>

<!-- Grid -->
<div class="grid grid-cols-3 gap-4">3 columns with gap</div>

<!-- Flexbox -->
<div class="flex items-center justify-between">Flex layout</div>

<!-- Responsive -->
<div class="hidden md:block">Hidden on mobile, visible on desktop</div>
```

### Custom CSS
Edit `admin/src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles */
@layer components {
  .btn-custom {
    @apply px-4 py-2 bg-green-600 text-white rounded;
  }
}
```

## 📦 Package Management

### Adding Package

```bash
# Backend
cd backend
npm install package-name
npm install --save-dev @types/package-name

# Admin
cd admin
npm install package-name
```

### Updating Packages

```bash
# Check outdated packages
npm outdated

# Update all
npm update

# Update specific package
npm install package-name@latest

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Removing Package

```bash
npm uninstall package-name
```

## 💾 Database Operations

### Viewing Data

```bash
npm run prisma:studio

# Or using psql
psql -U arad_user -d arad_agri_hub

# List tables
\dt

# View table structure
\d products

# Query data
SELECT * FROM products;
```

### Creating Sample Data

Edit `prisma/seed.ts` to add more sample data, then:
```bash
npm run prisma:seed
```

### Resetting Database

```bash
# WARNING: Deletes all data!
npm run prisma:db:reset

# This will:
# 1. Drop database
# 2. Create new database
# 3. Run migrations
# 4. Run seeds
```

## 🔄 Git Workflow

### Committing Changes

```bash
# Check status
git status

# Stage changes
git add .

# Commit
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"
git commit -m "docs: update documentation"

# Push
git push origin main
```

### Creating Feature Branch

```bash
git checkout -b feature/new-feature
# Make changes
git commit -m "feat: implement new feature"
git push origin feature/new-feature
# Create Pull Request on GitHub
```

## 📝 Code Patterns

### Error Handling

```typescript
// Backend
try {
  const product = await productService.getProduct(id);
} catch (error) {
  if (error instanceof NotFoundError) {
    return res.status(404).json({ success: false, message: error.message });
  }
  throw error; // Let error middleware handle
}

// Frontend
try {
  await mutation.mutateAsync(data);
} catch (error) {
  setError(error.message);
}
```

### Validation

```typescript
// Backend
function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Frontend
function validateForm(data: FormData): string[] {
  const errors: string[] = [];
  if (!data.email) errors.push('Email required');
  if (data.password.length < 8) errors.push('Password too short');
  return errors;
}
```

### Async Handling

```typescript
// Backend - Using asyncHandler wrapper
router.get('/:id', asyncHandler(async (req, res) => {
  // Errors automatically caught and handled
  const product = await getProduct(req.params.id);
  res.json({ success: true, data: product });
}));

// Frontend - Using React Query
const { data, isLoading, error } = useQuery({
  queryKey: ['product', id],
  queryFn: () => apiClient.getProduct(id),
});

if (isLoading) return <Loading />;
if (error) return <Error error={error} />;
return <ProductDetail product={data} />;
```

## 🎯 Performance Tips

### Backend
- Use pagination for lists
- Create database indexes
- Implement caching
- Use connection pooling
- Optimize queries with `.select()`

### Frontend
- Lazy load routes
- Memoize expensive computations
- Use React Query for caching
- Optimize images
- Code splitting

### Database
- Add indexes to frequently queried columns
- Archive old data
- Use appropriate data types
- Monitor slow queries
- Regular maintenance

## 🔗 Useful Links

- [Express.js Docs](https://expressjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [React Query Docs](https://tanstack.com/query/latest)

## 📞 Getting Help

### Common Issues

**Port already in use**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

**Database connection error**
- Check PostgreSQL running: `psql -U arad_user -d arad_agri_hub`
- Check DATABASE_URL in .env
- Check credentials

**Module not found**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build errors**
```bash
npm run type-check  # Find type errors
npm run lint        # Check for lint issues
```

## ✅ Before Committing

- [ ] Code follows project patterns
- [ ] No console.log statements
- [ ] Types are properly defined
- [ ] Error handling implemented
- [ ] Tested locally
- [ ] No hardcoded values
- [ ] Documentation updated if needed
- [ ] Commit message is clear

## 🚀 Deployment Checklist

- [ ] All tests passing
- [ ] No console.log statements
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] API endpoints tested
- [ ] Admin panel builds without errors
- [ ] No sensitive data in code
- [ ] Security best practices followed

---

**Pro Tip**: Bookmark this guide and refer to it often! 🎯

**Last Updated:** January 2024
**Version:** 1.0.0
