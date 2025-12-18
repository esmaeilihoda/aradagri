import { PrismaClient } from '@prisma/client';
import { passwordUtils } from '../src/core/utils/password.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await passwordUtils.hashPassword('Admin@123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aradagri.com' },
    update: {},
    create: {
      email: 'admin@aradagri.com',
      name: 'Admin User',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create sample categories
  const greenhouses = await prisma.category.upsert({
    where: { slug: 'greenhouses' },
    update: {},
    create: {
      name: 'Greenhouses',
      slug: 'greenhouses',
      description: 'Modern greenhouse structures',
    },
  });

  const vegetables = await prisma.category.upsert({
    where: { slug: 'vegetables' },
    update: {},
    create: {
      name: 'Vegetables',
      slug: 'vegetables',
      description: 'Fresh organic vegetables',
      parentId: greenhouses.id,
    },
  });

  const fruits = await prisma.category.upsert({
    where: { slug: 'fruits' },
    update: {},
    create: {
      name: 'Fruits',
      slug: 'fruits',
      description: 'Fresh organic fruits',
    },
  });

  console.log('✅ Categories created');

  // Create sample products
  const tomatoes = await prisma.product.upsert({
    where: { slug: 'organic-tomatoes' },
    update: {},
    create: {
      title: 'Organic Tomatoes',
      slug: 'organic-tomatoes',
      description: 'Fresh, pesticide-free tomatoes grown in our greenhouses',
      price: 12.99,
      stock: 100,
      unit: 'kg',
      categoryId: vegetables.id,
      images: ['https://via.placeholder.com/300?text=Tomatoes'],
      attributes: {
        color: 'red',
        origin: 'local',
        organic: true,
      },
    },
  });

  const apples = await prisma.product.upsert({
    where: { slug: 'fresh-apples' },
    update: {},
    create: {
      title: 'Fresh Apples',
      slug: 'fresh-apples',
      description: 'Crisp and sweet apples, perfect for health',
      price: 8.99,
      stock: 150,
      unit: 'kg',
      categoryId: fruits.id,
      images: ['https://via.placeholder.com/300?text=Apples'],
      attributes: {
        color: 'red',
        variety: 'Gala',
        organic: true,
      },
    },
  });

  console.log('✅ Products created');

  // Create sample services
  const greenhouseService = await prisma.service.upsert({
    where: { id: 'service-1' },
    update: {},
    create: {
      id: 'service-1',
      title: 'Greenhouse Structure Design',
      type: 'GREENHOUSE',
      description:
        'Complete greenhouse design and installation service with modern climate control systems',
      image: 'https://via.placeholder.com/300?text=Greenhouse',
    },
  });

  const consultationService = await prisma.service.upsert({
    where: { id: 'service-2' },
    update: {},
    create: {
      id: 'service-2',
      title: 'Agricultural Consultation',
      type: 'AI_AGRICULTURE',
      description:
        'AI-powered agricultural consultation for crop optimization and yield maximization',
      image: 'https://via.placeholder.com/300?text=AI-Agriculture',
    },
  });

  console.log('✅ Services created');

  console.log('✨ Database seeding completed!');
  console.log('📝 Admin credentials:');
  console.log('   Email: admin@aradagri.com');
  console.log('   Password: Admin@123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
