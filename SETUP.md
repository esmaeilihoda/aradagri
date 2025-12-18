# Arad Agricultural E-commerce Platform - Complete Setup Guide

Complete step-by-step guide to set up and run the Arad Agricultural E-commerce Platform.

## 📋 System Requirements

- **Node.js**: v16 or higher
- **npm**: v8 or higher (or yarn/pnpm)
- **PostgreSQL**: v12 or higher
- **Git**: for version control
- **Port Availability**: 3000 (backend), 3001 (admin), 5432 (PostgreSQL)

Check your versions:
```bash
node --version
npm --version
postgres --version
```

## 🗄️ Database Setup

### Install PostgreSQL

#### Windows
1. Download from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run installer
3. Remember the password for postgres user
4. Default port: 5432

#### macOS
```bash
brew install postgresql
brew services start postgresql
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

### Create Database

```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Create database
CREATE DATABASE arad_agri_hub;

# Create user
CREATE USER arad_user WITH PASSWORD 'secure_password_here';

# Grant privileges
ALTER ROLE arad_user WITH CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE arad_agri_hub TO arad_user;

# Exit psql
\q
```

Or use a GUI tool like pgAdmin:
1. Install pgAdmin
2. Create new database: `arad_agri_hub`
3. Create new user: `arad_user`
4. Assign privileges

## 🚀 Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create `.env` file in backend root:

```env
# Database
DATABASE_URL="postgresql://arad_user:your_password@localhost:5432/arad_agri_hub"

# JWT
JWT_SECRET="your-secret-key-min-32-characters-long"
JWT_REFRESH_SECRET="your-refresh-secret-key-min-32-characters"
JWT_EXPIRE_IN="7d"
JWT_REFRESH_EXPIRE_IN="30d"

# Server
PORT=3000
NODE_ENV=development

# Uploads
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=52428800

# CORS
CORS_ORIGIN=http://localhost:3001

# Email (optional, for future implementation)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

Generate secure secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Setup Database Schema

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with sample data
npm run prisma:seed
```

Or use Prisma Studio to visualize database:
```bash
npm run prisma:studio
```

### 5. Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm run build
npm start
```

Backend runs on `http://localhost:3000`

### 6. Verify Backend

- API Health: `http://localhost:3000/api/health`
- API Documentation: `http://localhost:3000/api-docs`
- Login with admin credentials

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aradagri.com","password":"Admin@123"}'
```

## 💻 Admin Panel Setup

### 1. Navigate to Admin Directory

```bash
cd admin
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Verify Configuration

Check `vite.config.ts` - proxy should point to backend:
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
  },
}
```

### 4. Start Development Server

```bash
npm run dev
```

Admin Panel runs on `http://localhost:3001`

### 5. Login

Navigate to `http://localhost:3001/login`

**Default credentials:**
- Email: `admin@aradagri.com`
- Password: `Admin@123`

## 🔄 Full Stack Development Workflow

### Terminal 1 - Database (if needed)
```bash
# Start PostgreSQL (if not running as service)
pg_ctl -D /path/to/data/directory start

# Or in PostgreSQL shell
sudo service postgresql start  # Linux
brew services start postgresql  # macOS
```

### Terminal 2 - Backend
```bash
cd backend
npm install
npm run dev
```

Wait for: `Server running on port 3000`

### Terminal 3 - Admin Panel
```bash
cd admin
npm install
npm run dev
```

Wait for: `VITE v... ready in ... ms`

Now you have:
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs
- **Admin Panel**: http://localhost:3001

## 📁 Project Structure

```
arad-agri-hub/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── index.ts           # Entry point
│   │   ├── app.ts             # Express app setup
│   │   ├── core/              # Core utilities
│   │   │   ├── config/        # Configuration
│   │   │   ├── middleware/    # Express middleware
│   │   │   └── utils/         # Helper functions
│   │   ├── modules/           # Feature modules
│   │   │   ├── auth/          # Authentication
│   │   │   ├── products/      # Product management
│   │   │   ├── categories/    # Category management
│   │   │   ├── cart/          # Shopping cart
│   │   │   ├── orders/        # Order management
│   │   │   ├── contact/       # Contact form
│   │   │   ├── services/      # Services
│   │   │   └── media/         # File uploads
│   │   └── types/             # TypeScript types
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   ├── migrations/        # Database migrations
│   │   └── seed.ts            # Seed script
│   ├── package.json
│   ├── tsconfig.json
│   ├── BACKEND_README.md      # Backend documentation
│   └── .env                   # Environment variables
│
├── admin/                      # React admin panel
│   ├── src/
│   │   ├── pages/             # Admin pages
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # API client
│   │   ├── types/             # TypeScript types
│   │   ├── App.tsx            # Main component
│   │   └── main.tsx           # Entry point
│   ├── public/                # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts         # Vite configuration
│   ├── tailwind.config.ts     # Tailwind configuration
│   ├── ADMIN_README.md        # Admin documentation
│   └── index.html
│
├── README.md                  # Project overview
├── SETUP.md                   # This file
└── .gitignore
```

## 🧪 Testing

### Backend API Testing

Using curl:
```bash
# Get all products
curl http://localhost:3000/api/products

# Create product (requires auth)
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Product","price":10,"description":"Desc"}'
```

Using Postman:
1. Import API documentation from `http://localhost:3000/api-docs`
2. Set authorization header with token
3. Test endpoints

Using API Documentation:
- Open `http://localhost:3000/api-docs`
- Swagger UI interface for all endpoints
- Try out requests directly

### Admin Panel Testing

1. Login page
2. Verify all CRUD operations work
3. Check error handling
4. Test pagination and filters
5. Verify form validation

## 🔐 Security Checklist

Before production deployment:

- [ ] Change JWT secrets (generate new ones)
- [ ] Update database credentials
- [ ] Enable HTTPS
- [ ] Configure CORS properly (specific origins, not wildcard)
- [ ] Set secure cookies with httpOnly flag
- [ ] Implement rate limiting
- [ ] Add input validation and sanitization
- [ ] Set up API rate limiting
- [ ] Enable SQL injection prevention (Prisma handles this)
- [ ] Implement request logging and monitoring
- [ ] Use environment variables for all secrets
- [ ] Set up firewall rules
- [ ] Enable database backups

## 📦 Production Deployment

### Backend Deployment

#### Using Render
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set environment variables
5. Deploy

#### Using Heroku
```bash
heroku login
heroku create arad-agri-api
heroku addons:create heroku-postgresql:standard-0
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

#### Using Railway
1. Connect GitHub
2. Create PostgreSQL database
3. Set environment variables
4. Deploy

### Admin Panel Deployment

#### Using Vercel
```bash
npm install -g vercel
vercel
```

#### Using Netlify
```bash
npm run build
# Deploy dist folder to Netlify
```

#### Using GitHub Pages
Configure and deploy dist folder

## 🔄 Database Migrations

After schema changes:

```bash
# Create new migration
npm run prisma:migrate -- --name your_migration_name

# Review migration file in prisma/migrations/
# Then apply it

# Or push schema without creating migration
npm run prisma:db:push
```

## 📝 Useful Commands

### Backend
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:seed      # Seed database
npm run prisma:studio    # Open Prisma Studio
npm run type-check       # Check types
npm run lint             # Lint code
```

### Admin Panel
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run type-check       # Check types
npm run lint             # Lint code
```

## 🆘 Troubleshooting

### Backend Issues

**Port 3000 already in use**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID YOUR_PID /F

# macOS/Linux
lsof -i :3000
kill -9 PID
```

**Database connection error**
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database and user exist

**Prisma migration error**
```bash
npm run prisma:migrate:reset  # Reset database (clears all data)
npm run prisma:seed           # Re-seed
```

**API documentation not loading**
- Ensure swagger-jsdoc is installed
- Check swagger configuration in app.ts

### Admin Panel Issues

**API not connecting**
- Verify backend is running on port 3000
- Check proxy configuration in vite.config.ts
- Check browser console for CORS errors

**Node modules issues**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Port 3001 already in use**
Change port in vite.config.ts or kill process on port 3001

### General Issues

**Node version mismatch**
- Update Node.js to v16+
- Clear npm cache: `npm cache clean --force`

**Dependencies won't install**
```bash
rm -rf node_modules
npm cache clean --force
npm install
```

**Build fails**
- Check for TypeScript errors: `npm run type-check`
- Check console for error messages
- Update dependencies: `npm update`

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 📞 Support

For detailed API documentation, see `backend/BACKEND_README.md`
For admin panel documentation, see `admin/ADMIN_README.md`

## 🎯 Next Steps

1. ✅ Complete setup with this guide
2. ✅ Verify all systems running
3. ✅ Test API endpoints
4. ✅ Test admin panel features
5. ⏭️ Customize branding and colors
6. ⏭️ Add more products and categories
7. ⏭️ Configure email notifications
8. ⏭️ Set up payment processing
9. ⏭️ Deploy to production

---

**Happy coding! 🚀**
