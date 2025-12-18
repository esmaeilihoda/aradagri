import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('Starting database seed...');

  try {
    // Clear existing data
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    // Create categories
    const seedlings = await prisma.category.create({
      data: { name: 'نهال', slug: 'seedlings', description: 'انواع نهال میوه و درختان زینتی' }
    });

    const seeds = await prisma.category.create({
      data: { name: 'بذر', slug: 'seeds', description: 'بذرهای با کیفیت و پربار' }
    });

    const fertilizers = await prisma.category.create({
      data: { name: 'کود', slug: 'fertilizers', description: 'کودهای ارگانیک و شیمیایی' }
    });

    const pesticides = await prisma.category.create({
      data: { name: 'سم', slug: 'pesticides', description: 'سموم و آفت‌کش‌های استاندارد' }
    });

    // Create products for Seedlings
    const seedlingProducts = [
      {
        title: 'نهال سیب گلاب سفید',
        slug: 'seedling-apple-1',
        description: 'نهال سیب پرمحصول با کیفیت عالی و تقاوم بالا',
        price: 450000,
        stock: 50,
        categoryId: seedlings.id,
        images: ['https://images.unsplash.com/photo-1560806887-1-1e4cd0b6cbd6?w=400&h=400&fit=crop'],
      },
      {
        title: 'نهال انگور بدون هسته',
        slug: 'seedling-grape-1',
        description: 'نهال انگور شیرین و خوشمزه',
        price: 320000,
        stock: 35,
        categoryId: seedlings.id,
        images: ['https://images.unsplash.com/photo-1560806888-2-1e4cd0b6cbd6?w=400&h=400&fit=crop'],
      },
      {
        title: 'نهال هلو ملوی',
        slug: 'seedling-peach-1',
        description: 'نهال هلو خوشمزه و مقاوم',
        price: 380000,
        stock: 42,
        categoryId: seedlings.id,
        images: ['https://images.unsplash.com/photo-1560806889-3-1e4cd0b6cbd6?w=400&h=400&fit=crop'],
      },
    ];

    // Create products for Seeds
    const seedProducts = [
      {
        title: 'بذر گوجه‌فرنگی هیبرید',
        slug: 'seed-tomato-hybrid',
        description: 'بذر گوجه‌فرنگی پرمحصول و مقاوم به بیماری',
        price: 125000,
        stock: 200,
        categoryId: seeds.id,
        images: ['https://images.unsplash.com/photo-1560806890-4-1e4cd0b6cbd6?w=400&h=400&fit=crop'],
      },
      {
        title: 'بذر خیار بلند',
        slug: 'seed-cucumber-long',
        description: 'بذر خیار با عملکرد بالا',
        price: 95000,
        stock: 150,
        categoryId: seeds.id,
        images: ['https://images.unsplash.com/photo-1560806891-5-1e4cd0b6cbd6?w=400&h=400&fit=crop'],
      },
      {
        title: 'بذر فلفل دلمه ای',
        slug: 'seed-pepper-bell',
        description: 'بذر فلفل رنگی و پرمحصول',
        price: 110000,
        stock: 120,
        categoryId: seeds.id,
        images: ['https://images.unsplash.com/photo-1560806892-6-1e4cd0b6cbd6?w=400&h=400&fit=crop'],
      },
    ];

    // Create products for Fertilizers
    const fertilizerProducts = [
      {
        title: 'کود ارگانیک کمپوست',
        slug: 'fertilizer-organic-compost',
        description: 'کود ارگانیک طبیعی و بدون شیمیایی',
        price: 180000,
        stock: 500,
        categoryId: fertilizers.id,
        images: ['https://images.unsplash.com/photo-1560806893-7-1e4cd0b6cbd6?w=400&h=400&fit=crop'],
      },
      {
        title: 'کود شیمیایی NPK 16-16-16',
        slug: 'fertilizer-chemical-npk',
        description: 'کود متوازن برای تمام گیاهان',
        price: 95000,
        stock: 800,
        categoryId: fertilizers.id,
        images: ['https://images.unsplash.com/photo-1560806894-8-1e4cd0b6cbd6?w=400&h=400&fit=crop'],
      },
      {
        title: 'کود ریزمغذی',
        slug: 'fertilizer-micronutrient',
        description: 'کود کمپلکس حاوی عناصر ریزمغذی',
        price: 220000,
        stock: 300,
        categoryId: fertilizers.id,
        images: ['https://images.unsplash.com/photo-1560806895-9-1e4cd0b6cbd6?w=400&h=400&fit=crop'],
      },
    ];

    // Create products for Pesticides
    const pesticideProducts = [
      {
        title: 'حشره‌کش بیولوژیک',
        slug: 'pesticide-bio-insecticide',
        description: 'حشره‌کش طبیعی و ایمن',
        price: 250000,
        stock: 100,
        categoryId: pesticides.id,
        images: ['https://images.unsplash.com/photo-1560806896-10-1e4cd0b6cbd6?w=400&h=400&fit=crop'],
      },
      {
        title: 'قارچ‌کش سیستمی',
        slug: 'pesticide-systemic-fungicide',
        description: 'قارچ‌کش قوی برای مبارزه با بیماری‌های قارچی',
        price: 310000,
        stock: 75,
        categoryId: pesticides.id,
        images: ['https://images.unsplash.com/photo-1560806897-11-1e4cd0b6cbd6?w=400&h=400&fit=crop'],
      },
      {
        title: 'علف‌کش انتخابی',
        slug: 'pesticide-selective-herbicide',
        description: 'علف‌کش کنترل‌شده برای محصولات',
        price: 165000,
        stock: 200,
        categoryId: pesticides.id,
        images: ['https://images.unsplash.com/photo-1560806898-12-1e4cd0b6cbd6?w=400&h=400&fit=crop'],
      },
    ];

    // Insert all products
    const allProducts = [...seedlingProducts, ...seedProducts, ...fertilizerProducts, ...pesticideProducts];
    
    for (const product of allProducts) {
      await prisma.product.create({ data: product });
    }

    console.log(`✅ Seeded ${allProducts.length} products across 4 categories`);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
