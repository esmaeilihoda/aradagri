import { PrismaClient } from '@prisma/client';
import { generateSlug, getPaginationParams } from '../../core/utils/helpers.js';
import { ValidationError, NotFoundError, ConflictError } from '../../core/utils/errors.js';

const prisma = new PrismaClient();

export class ProductService {
  async createProduct(
    title: string,
    description: string,
    price: number,
    categoryId: string,
    stock?: number,
    unit?: string,
    images?: string[],
    attributes?: any
  ) {
    const slug = generateSlug(title);

    // Check if slug exists
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictError('Product with this title already exists');
    }

    // Check if category exists
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price,
        stock: stock || 0,
        unit: unit || 'kg',
        images: images || [],
        attributes,
        categoryId,
      },
      include: { category: true },
    });

    return product;
  }

  async getProducts(
    page: number = 1,
    limit: number = 10,
    categoryId?: string,
    search?: string,
    minPrice?: number,
    maxPrice?: number,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    const { skip, take } = getPaginationParams(page, limit);

    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: { category: true },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    return product;
  }

  async getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    return product;
  }

  async updateProduct(
    id: string,
    title?: string,
    description?: string,
    price?: number,
    stock?: number,
    unit?: string,
    images?: string[],
    attributes?: any
  ) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const data: any = {};

    if (title && title !== product.title) {
      const newSlug = generateSlug(title);
      const existing = await prisma.product.findUnique({
        where: { slug: newSlug },
      });
      if (existing && existing.id !== id) {
        throw new ConflictError('Product with this title already exists');
      }
      data.title = title;
      data.slug = newSlug;
    }

    if (description) data.description = description;
    if (price !== undefined) data.price = price;
    if (stock !== undefined) data.stock = stock;
    if (unit) data.unit = unit;
    if (images) data.images = images;
    if (attributes) data.attributes = attributes;

    const updated = await prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    });

    return updated;
  }

  async deleteProduct(id: string) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    await prisma.product.delete({ where: { id } });
    return { message: 'Product deleted successfully' };
  }

  async addProductImage(productId: string, imageUrl: string) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const images = product.images || [];
    if (!images.includes(imageUrl)) {
      images.push(imageUrl);
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: { images },
    });

    return updated;
  }

  async removeProductImage(productId: string, imageUrl: string) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const images = (product.images || []).filter((img) => img !== imageUrl);

    const updated = await prisma.product.update({
      where: { id: productId },
      data: { images },
    });

    return updated;
  }
}

export const productService = new ProductService();
