# Arad Agricultural E-commerce - Admin Panel

Modern admin dashboard for managing the Arad Agricultural E-commerce Platform built with React, Vite, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Admin Panel runs on `http://localhost:3001`
Proxies API calls to backend at `http://localhost:3000`

## 📋 Features

- ✅ **Dashboard** - Overview with key metrics and statistics
- ✅ **Product Management** - Create, read, update, delete products
- ✅ **Category Management** - Manage product categories with tree structure
- ✅ **Order Management** - View and manage customer orders
- ✅ **Contact Inbox** - View and manage contact form submissions
- ✅ **User Management** - Manage user accounts and roles
- ✅ **Media Gallery** - Upload and manage product images
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Real-time Updates** - Uses React Query for optimal data fetching
- ✅ **Dark Mode Ready** - Tailwind CSS styling

## 🔐 Login

Navigate to `http://localhost:3001/login`

**Default Admin Credentials** (after seeding):
- Email: `admin@aradagri.com`
- Password: `Admin@123`

## 📱 Pages & Features

### Dashboard
- Overview of key metrics
- Total products count
- Total orders count
- Total contact messages
- Revenue tracking
- Quick action buttons to main sections

### Products
- View all products in paginated table
- Search products by name/description
- Filter by category
- Create new products with:
  - Title, description, price
  - Category selection
  - Stock management
  - Image uploads
  - Custom attributes
- Edit existing products
- Delete products
- Manage product images

### Categories
- View category tree structure
- Create new categories
- Parent-child category relationships
- Edit category details
- Delete categories
- Expandable tree navigation

### Orders
- View all customer orders
- Filter orders by status:
  - PENDING
  - PROCESSING
  - COMPLETED
  - CANCELLED
- Update order status
- View order details and items
- Cancel orders
- Pagination support

### Messages
- View all contact form submissions
- Filter by read/unread status
- Mark messages as read
- Reply via email
- Delete messages
- Contact information display

## 🛠 Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API Client**: Axios
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Date Formatting**: date-fns

## 📁 Project Structure

```
src/
├── pages/                    # Main pages
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── ProductsPage.tsx
│   ├── CategoriesPage.tsx
│   ├── OrdersPage.tsx
│   └── ContactPage.tsx
├── components/
│   ├── layout/              # Layout components
│   │   ├── Sidebar.tsx
│   │   └── index.ts
│   ├── forms/               # Form components
│   ├── tables/              # Data table components
│   └── dialogs/             # Modal dialogs
├── hooks/                   # Custom React hooks
│   ├── useAuth.ts          # Authentication hook
│   ├── useProducts.ts      # Products queries
│   ├── useCategories.ts    # Categories queries
│   ├── useOrders.ts        # Orders queries
│   ├── useContact.ts       # Contact queries
│   └── index.ts            # Exports
├── services/
│   └── api.ts              # API client with all endpoints
├── types/
│   └── index.ts            # TypeScript type definitions
├── lib/
│   └── utils.ts            # Utility functions
├── App.tsx                 # Main app component
├── main.tsx                # Entry point
└── index.css               # Global styles
```

## 🔗 API Integration

### API Client
Located at `src/services/api.ts`

```typescript
import { apiClient } from '@/services/api';

// Login
const { data } = await apiClient.login(email, password);

// Get products
const { data } = await apiClient.getProducts(page, limit, categoryId);

// Create product
const { data } = await apiClient.createProduct(...);
```

### Custom Hooks
Pre-built hooks for data fetching and mutations:

```typescript
// Queries
const { data, isLoading } = useProducts(page, limit);
const { data: categories } = useCategories();
const { data: orders } = useOrders(page, limit, status);

// Mutations
const createMutation = useCreateProduct();
const updateMutation = useUpdateProduct(id);
const deleteMutation = useDeleteProduct();

// Usage
await createMutation.mutateAsync({...productData});
```

## 🎨 Styling

Uses Tailwind CSS for styling with a custom color scheme:
- Primary: Green (#059669)
- Secondary: Blue (#3B82F6)
- Danger: Red (#DC2626)
- Warning: Orange (#F97316)

### Custom Components
Common UI components available:
- Buttons
- Input fields
- Select dropdowns
- Tables
- Forms
- Modals
- Cards
- Badges
- Status indicators

## 📊 Dashboard Metrics

The dashboard displays:
- **Total Products**: Count of all products
- **Total Orders**: Count of all orders
- **Contact Messages**: Count of contact submissions
- **Revenue**: Sum of all completed order amounts

## 🔐 Authentication

### Login Flow
1. Enter email and password
2. Receive JWT token and refresh token
3. Token stored in localStorage
4. Automatically included in API requests
5. Auto-logout on token expiration

### Protected Routes
Routes are protected with `ProtectedRoute` component:
```typescript
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

Unauthenticated users are redirected to login page.

## 🚀 Building for Production

```bash
# Build
npm run build

# Preview build locally
npm run preview

# Output in dist/ folder ready for deployment
```

Deploy the `dist` folder to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Any static hosting

## 📦 Dependencies

### Main Dependencies
- **react**: UI library
- **react-dom**: DOM rendering
- **react-router-dom**: Routing
- **@tanstack/react-query**: Data fetching & caching
- **axios**: HTTP client
- **tailwindcss**: CSS framework
- **lucide-react**: Icons
- **date-fns**: Date formatting

### Dev Dependencies
- **typescript**: Type safety
- **vite**: Build tool
- **@vitejs/plugin-react**: Vite React plugin
- **tailwindcss**: CSS framework
- **postcss**: CSS processing
- **autoprefixer**: CSS vendor prefixes

## 🔄 State Management

### React Query (TanStack Query)
Used for:
- Fetching data from API
- Caching responses
- Automatic invalidation
- Background refetching
- Loading and error states

Example:
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['products', page],
  queryFn: () => apiClient.getProducts(page),
});
```

### Local State (useState)
Used for:
- UI state (modals, forms)
- Form data
- Filters
- Pagination

## 📝 Form Management

Forms use standard React patterns:
```typescript
const [formData, setFormData] = useState({...});

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await mutation.mutateAsync(formData);
    // Success
  } catch (error) {
    // Error handling
  }
};
```

## 🎯 Best Practices

1. **Component Organization**
   - Keep components small and focused
   - Use custom hooks for logic
   - Separate containers and presentational components

2. **API Communication**
   - Use custom hooks for all API calls
   - Handle errors consistently
   - Show loading and error states

3. **Performance**
   - Use React Query for caching
   - Memoize expensive computations
   - Lazy load routes

4. **Type Safety**
   - Use TypeScript for all files
   - Define interfaces for API responses
   - Use strict mode

5. **Styling**
   - Use Tailwind CSS utilities
   - Create reusable component classes
   - Maintain consistent spacing

## 🐛 Debugging

### Dev Tools
```bash
npm run dev
```

Open browser DevTools:
- React DevTools extension
- Network tab for API calls
- Console for errors

### React Query DevTools
Available in development for debugging queries:
```
@tanstack/react-query-devtools
```

## 📞 Troubleshooting

### API Not Connecting
- Ensure backend is running on port 3000
- Check CORS configuration in backend
- Verify API_BASE_URL in vite.config.ts

### Login Issues
- Verify credentials
- Check JWT tokens in localStorage
- Clear browser cache

### Data Not Loading
- Check browser console for errors
- Verify API response in Network tab
- Check React Query DevTools

## 🌐 Environment Configuration

Backend API is proxied through Vite:
```typescript
// vite.config.ts
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
  },
}
```

For production, update to your backend URL.

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [React Router Documentation](https://reactrouter.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🎨 Customization

### Change Brand Colors
Edit `tailwind.config.ts` and `src/index.css`

### Add New Pages
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/layout/Sidebar.tsx`

### Modify API Endpoints
Update `src/services/api.ts` with new methods

### Change UI Design
Modify Tailwind classes in components

## 📤 Deployment

### Vercel
```bash
npm run build
# Deploy dist folder to Vercel
```

### Netlify
```bash
npm run build
# Deploy dist folder to Netlify
```

### GitHub Pages
```bash
npm run build
# Push dist folder to gh-pages branch
```

## 🔒 Security

- JWT tokens stored in localStorage (consider using httpOnly cookies for production)
- Token included in all API requests
- Protected routes require authentication
- CORS handled by backend

## 📞 Support

For issues, feature requests, or questions, please refer to the main project documentation or open an issue.

---

**Built with ❤️ for Arad Agricultural E-commerce Platform**
