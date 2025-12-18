# Arad Agricultural E-commerce Platform - Deployment & Production Guide

Complete guide to preparing, deploying, and maintaining the platform in production.

## ✅ Pre-Deployment Checklist

### Security Review
- [ ] Change all default credentials
- [ ] Generate new JWT secrets (minimum 32 characters)
- [ ] Update database credentials to strong passwords
- [ ] Review all environment variables in .env
- [ ] Ensure no secrets in code/git history
- [ ] Remove console.log statements (or use proper logging)
- [ ] Enable HTTPS/TLS certificates
- [ ] Set secure CORS headers (specific origins only)
- [ ] Configure CSRF protection if needed
- [ ] Enable rate limiting on API endpoints
- [ ] Set up request validation and sanitization
- [ ] Review authentication flow for vulnerabilities
- [ ] Implement SQL injection prevention (Prisma ORM handles this)
- [ ] Check for XSS vulnerabilities in admin panel
- [ ] Review file upload restrictions

### Performance Review
- [ ] Optimize database indexes for common queries
- [ ] Review slow query logs
- [ ] Configure query result pagination
- [ ] Implement caching strategy (Redis recommended)
- [ ] Compress responses (gzip/brotli)
- [ ] Optimize images and static assets
- [ ] Set up CDN for static content
- [ ] Configure connection pooling for database
- [ ] Set up API rate limiting and throttling
- [ ] Optimize frontend bundle size
- [ ] Enable lazy loading for routes
- [ ] Configure proper cache headers

### Data & Backup
- [ ] Verify database backups are configured
- [ ] Test backup restore process
- [ ] Set up automated backups (daily minimum)
- [ ] Configure point-in-time recovery
- [ ] Plan data retention policy
- [ ] Archive old orders and contact submissions
- [ ] Set up monitoring for database size

### Infrastructure
- [ ] Choose hosting platform (Render, Railway, Heroku, AWS, etc.)
- [ ] Set up production PostgreSQL instance
- [ ] Configure firewall rules
- [ ] Set up CDN for static assets
- [ ] Configure domain and DNS
- [ ] Enable HTTPS with valid certificate
- [ ] Set up monitoring and alerting
- [ ] Configure log aggregation
- [ ] Plan disaster recovery

### Testing
- [ ] Run full test suite
- [ ] Perform load testing
- [ ] Test all critical user flows
- [ ] Verify API endpoints response times
- [ ] Test authentication/authorization
- [ ] Verify file uploads work correctly
- [ ] Test email notifications (if implemented)
- [ ] Verify error handling and recovery
- [ ] Test with different browsers/devices
- [ ] Performance testing with production-like data

### Documentation
- [ ] Update deployment documentation
- [ ] Document environment variables
- [ ] Create runbooks for common operations
- [ ] Document monitoring dashboards
- [ ] Create incident response procedures
- [ ] Document database backup/restore procedures
- [ ] Create API documentation for consumers
- [ ] Document admin panel features
- [ ] Create troubleshooting guides

## 🚀 Backend Deployment

### Option 1: Render.com (Recommended for beginners)

#### 1. Prepare Backend
```bash
cd backend
npm install
npm run build
```

#### 2. Create Render Service
1. Sign up at render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - **Name**: arad-agri-api
   - **Environment**: Node
   - **Region**: Choose closest to users
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

#### 3. Set Environment Variables
In Render dashboard → Environment:
```
DATABASE_URL=postgresql://user:password@db.example.com:5432/arad_agri_hub
JWT_SECRET=<generate-new-32-char-secret>
JWT_REFRESH_SECRET=<generate-new-32-char-secret>
JWT_EXPIRE_IN=7d
JWT_REFRESH_EXPIRE_IN=30d
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-admin-domain.com
UPLOAD_DIR=./uploads
```

#### 4. Database Setup
1. Create PostgreSQL database on Render
2. Get connection string
3. Run migrations:
```bash
DATABASE_URL="connection-string" npm run prisma:migrate
DATABASE_URL="connection-string" npm run prisma:seed
```

#### 5. Deploy
- Push to GitHub → Automatic deployment
- Monitor logs in Render dashboard

### Option 2: Railway.app

#### 1. Prepare
```bash
npm install -g railway
railway login
```

#### 2. Project Setup
```bash
cd backend
railway init
```

#### 3. Add PostgreSQL
```bash
railway add # Select PostgreSQL
```

#### 4. Deploy
```bash
railway up
```

#### 5. View Logs
```bash
railway logs
```

### Option 3: AWS (More complex but powerful)

#### 1. Elastic Beanstalk
```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p node.js-18 arad-agri-api

# Create environment
eb create arad-agri-prod

# Deploy
eb deploy
```

#### 2. RDS for PostgreSQL
- Create RDS instance
- Configure security groups
- Create database and user
- Get connection string

#### 3. Environment Configuration
```bash
eb setenv DATABASE_URL="postgresql://..." \
  JWT_SECRET="..." \
  NODE_ENV=production
```

#### 4. Deploy
```bash
git push
eb deploy
```

### Option 4: Docker Deployment

#### 1. Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### 2. Create .dockerignore
```
node_modules
npm-debug.log
.env.local
.git
dist
uploads
```

#### 3. Build & Test Locally
```bash
docker build -t arad-agri-api:latest .
docker run -p 3000:3000 -e DATABASE_URL="..." arad-agri-api:latest
```

#### 4. Push to Registry
```bash
docker tag arad-agri-api:latest yourusername/arad-agri-api:latest
docker push yourusername/arad-agri-api:latest
```

#### 5. Deploy with Docker Compose
```yaml
version: '3.8'
services:
  api:
    image: yourusername/arad-agri-api:latest
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://user:password@db:5432/arad_agri_hub
      JWT_SECRET: your-secret
      NODE_ENV: production
    depends_on:
      - db
  
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: arad_agri_hub
      POSTGRES_USER: arad_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 🌐 Frontend (Admin Panel) Deployment

### Option 1: Vercel (Recommended)

#### 1. Build
```bash
cd admin
npm run build
```

#### 2. Deploy via CLI
```bash
npm i -g vercel
vercel
```

#### 3. Configure
- Select project
- Confirm settings
- Automatic deployment from Git

#### 4. Environment Variables
In Vercel Dashboard:
```
VITE_API_URL=https://api.your-domain.com
```

#### 5. Update API Endpoint
In `admin/vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
```

### Option 2: Netlify

#### 1. Build
```bash
cd admin
npm run build
```

#### 2. Deploy
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

Or connect GitHub repository for automatic deployments.

#### 3. Configure
- Set build command: `npm run build`
- Set publish directory: `dist`
- Add environment variables

#### 4. Redirect Rules
Create `admin/netlify.toml`:
```toml
[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

### Option 3: AWS S3 + CloudFront

#### 1. Build
```bash
cd admin
npm run build
```

#### 2. Create S3 Bucket
```bash
aws s3 mb s3://arad-agri-admin --region us-east-1
aws s3 website s3://arad-agri-admin/ \
  --index-document index.html \
  --error-document index.html
```

#### 3. Upload Build
```bash
aws s3 sync dist/ s3://arad-agri-admin/ --delete
```

#### 4. Create CloudFront Distribution
- Origin: S3 bucket
- Default root object: index.html
- Error responses: Route 404 to index.html
- Enable compression

#### 5. Configure Domain
Point domain to CloudFront distribution

#### 6. Automate with GitHub Actions
```yaml
name: Deploy to AWS

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd admin && npm install && npm run build
      - uses: configure-aws-credentials-action-major@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - run: aws s3 sync admin/dist/ s3://arad-agri-admin/ --delete
      - run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CF_DISTRIBUTION_ID }} --paths "/*"
```

### Option 4: GitHub Pages

#### 1. Configure Router
In `admin/src/App.tsx`:
```typescript
<BrowserRouter basename="/arad-agri-admin">
  {/* Routes */}
</BrowserRouter>
```

#### 2. Update Vite Config
```typescript
export default defineConfig({
  base: '/arad-agri-admin/',
  // ...
})
```

#### 3. Build
```bash
npm run build
```

#### 4. Deploy
```bash
npm install --save-dev gh-pages
# Add to package.json:
"deploy": "npm run build && gh-pages -d dist"

npm run deploy
```

## 📊 Monitoring & Logging

### Backend Monitoring

#### Application Performance Monitoring (APM)
Install APM tool:
```bash
npm install elastic-apm-node
```

Add to `src/index.ts`:
```typescript
if (process.env.NODE_ENV === 'production') {
  require('elastic-apm-node').start({
    serviceName: 'arad-agri-api',
    secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
    serverUrl: process.env.ELASTIC_APM_SERVER_URL,
  });
}
```

#### Logging
```typescript
// Install winston
npm install winston

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Usage
logger.info('Order created', { orderId, userId });
logger.error('Database error', { error });
```

#### Error Tracking (Sentry)
```typescript
npm install @sentry/node

import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

### Frontend Monitoring

#### Error Tracking (Sentry)
```typescript
npm install @sentry/react

import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});
```

#### Analytics
```bash
npm install google-analytics-react-gtag
```

## 🗄️ Database Management

### Backups

#### Automated Backups (PostgreSQL)
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="/backups/arad_agri_hub_${DATE}.sql"

pg_dump -U arad_user -h localhost arad_agri_hub > $BACKUP_FILE
gzip $BACKUP_FILE

# Keep only last 30 days
find /backups -name "*.sql.gz" -mtime +30 -delete
```

#### Cloud Backups
- Enable automated backups on RDS/Render
- Store backups in S3/cloud storage
- Test restore procedures regularly

### Migrations in Production

```bash
# Test migrations locally first
NODE_ENV=development npm run prisma:migrate

# Then in production
NODE_ENV=production npm run prisma:migrate -- --skip-generate

# If you need to revert
npm run prisma:migrate resolve -- --rolled-back <migration-name>
```

## 🔒 Security in Production

### HTTPS/TLS
- Use valid SSL certificate from Let's Encrypt or CA
- Redirect HTTP to HTTPS
- Set HSTS header:
```typescript
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});
```

### Rate Limiting
```bash
npm install express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### CORS
```typescript
app.use(cors({
  origin: [
    'https://admin.your-domain.com',
    'https://www.your-domain.com',
  ],
  credentials: true,
}));
```

### Environment Security
```bash
# Store in secure configuration service
# Use GitHub Secrets for deployment
# Rotate secrets regularly
# Never commit .env files
```

## 📈 Scaling Strategy

### Phase 1: Initial Launch (< 1000 users)
- Single backend instance
- Managed PostgreSQL
- S3 for file uploads
- CDN for static assets

### Phase 2: Growth (1000-10000 users)
- Multiple backend instances with load balancer
- Database read replicas
- Redis for caching
- Queue system for background jobs (Bull/RabbitMQ)

### Phase 3: Scale (10000+ users)
- Microservices architecture
- Database sharding
- Event-driven architecture
- Advanced caching strategy
- Full CDN coverage

## 🚨 Incident Response

### Database Down
1. Check database service status
2. Review database logs
3. Attempt graceful restart
4. Failover to replica if available
5. Restore from backup if needed
6. Communicate status to users

### API Outage
1. Check application logs
2. Verify database connectivity
3. Check disk space
4. Restart application service
5. If issue persists, roll back to previous version

### Security Breach
1. Immediately revoke compromised tokens
2. Force password reset for affected users
3. Analyze logs for unauthorized access
4. Update security measures
5. Notify users if necessary

## 📋 Post-Deployment Checklist

- [ ] Verify all services running
- [ ] Check API endpoints respond
- [ ] Test authentication flow
- [ ] Verify file uploads work
- [ ] Check admin panel access
- [ ] Verify email notifications (if applicable)
- [ ] Monitor error logs
- [ ] Test backup process
- [ ] Monitor performance metrics
- [ ] Create incident response documentation
- [ ] Train team on deployment process
- [ ] Schedule regular maintenance window
- [ ] Review and optimize costs
- [ ] Plan for next update/release

## 🔄 Continuous Deployment (CI/CD)

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd backend && npm install && npm run lint && npm run type-check
      - run: cd admin && npm install && npm run lint && npm run type-check

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy Backend
        run: |
          git push https://git.render.com/arad-agri-api.git main
      - name: Deploy Admin
        run: |
          npm --prefix admin run build
          npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## 📞 Support & Maintenance

### Regular Tasks
- **Daily**: Check error logs
- **Weekly**: Review performance metrics
- **Monthly**: Update dependencies, security patches
- **Quarterly**: Database optimization, capacity planning
- **Annually**: Security audit, disaster recovery test

### Useful Commands

```bash
# View logs
npm run logs

# Database maintenance
npm run prisma:studio

# Check performance
npm run analyze

# Generate report
npm run report
```

---

**Last Updated:** January 2024
**Version:** 1.0.0

---

**Ready to deploy? Choose your platform and follow the steps above. Happy shipping! 🚀**
