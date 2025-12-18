import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  databaseUrl: process.env.DATABASE_URL,
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'jwt_secret_key',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'jwt_refresh_secret_key',
  jwtExpiration: process.env.JWT_EXPIRATION || '7d',
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '30d',
  
  // CORS
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(','),
  
  // File Upload
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800'),
  allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,image/webp').split(','),
  uploadDir: './uploads',
  
  // Email
  smtpHost: process.env.SMTP_HOST,
  smtpPort: parseInt(process.env.SMTP_PORT || '587'),
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  senderEmail: process.env.SENDER_EMAIL,
  
  // Admin Panel
  adminPanelUrl: process.env.ADMIN_PANEL_URL || 'http://localhost:3001',
};
