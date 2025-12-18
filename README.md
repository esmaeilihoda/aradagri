# Arad Agricultural E-commerce Platform

Complete backend and admin panel for the Arad Agricultural E-commerce Platform built with Node.js/Express, PostgreSQL, Prisma ORM, React, and Vite.

## 📋 Quick Start

### Prerequisites
- Node.js v18+
- PostgreSQL v13+
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure DATABASE_URL and JWT secrets in .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Backend runs on `http://localhost:3000`
API Docs: `http://localhost:3000/api-docs`

### Admin Panel Setup
```bash
cd admin
npm install
npm run dev
```

Admin Panel runs on `http://localhost:3001`

## ✨ Features

### Backend API
- ✅ JWT Authentication with refresh tokens
- ✅ Role-based access control (Admin, Staff, Customer)
- ✅ Product Management with CRUD, filtering, pagination
- ✅ Category Management with tree-structured hierarchies
- ✅ Shopping Cart with guest support
- ✅ Order System with status workflow
- ✅ Contact Form endpoints
- ✅ Services Management
- ✅ Media Upload
- ✅ OpenAPI/Swagger Documentation

### Admin Panel
- ✅ Dashboard with analytics
- ✅ Product Management
- ✅ Category Editor
- ✅ Order Management
- ✅ Contact Inbox
- ✅ Responsive Design with Tailwind CSS
- ✅ Protected Routes with JWT

## 🛠 Tech Stack

**Backend**: Node.js, Express, TypeScript, PostgreSQL, Prisma
**Admin**: React 18, Vite, TypeScript, Tailwind CSS, React Query

## 📁 Project Structure

```
backend/
├── src/modules/     # Feature modules (auth, products, etc)
├── src/core/        # Middleware, utils, config
├── prisma/          # Database schema & migrations
└── uploads/         # File storage

admin/
├── src/pages/       # Main pages
├── src/components/  # React components
├── src/hooks/       # Custom hooks
└── src/services/    # API client
```

## 📚 API Documentation

Swagger UI available at `http://localhost:3000/api-docs`

### Key Endpoints
- **Auth**: Register, Login, Refresh Token
- **Products**: CRUD with filtering & pagination
- **Categories**: Tree-structured management
- **Cart**: Add/remove items, merge guest carts
- **Orders**: Create, track, manage orders
- **Contact**: Capture leads
- **Services**: Manage service offerings
- **Media**: Upload & manage files

## 🔑 Environment Variables

Backend `.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/arad_agri
PORT=3000
JWT_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
CORS_ORIGIN=http://localhost:5173,http://localhost:3001
```

## 🗄 Database

```bash
# Create database
createdb arad_agri

# Run migrations
cd backend
npm run prisma:migrate

# View with Prisma Studio
npm run prisma:studio
```

## 📦 Deployment

**Backend**: Deploy to Node.js host (Render, Railway, Heroku)
**Admin**: Deploy static build to Vercel, Netlify, etc.

## 🔒 Security

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control
- CORS protection
- Input validation
- Secure file uploads

## 📞 Support

For issues or questions, please refer to the comprehensive documentation in the codebase or open an issue.

---

**Built with ❤️ for Arad Agricultural E-commerce Platform**
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
