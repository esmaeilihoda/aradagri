import { PrismaClient } from '@prisma/client';
import { generateSlug } from '../../core/utils/helpers.js';
import { ValidationError, NotFoundError, ConflictError } from '../../core/utils/errors.js';

const prisma = new PrismaClient();

export class CategoryService {
  async createCategory(name: string, parentId?: string, description?: string, image?: string) {
    const slug = generateSlug(name);

    // Check if slug already exists
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictError('Category with this name already exists');
    }

    // Check if parent exists
    if (parentId) {
      const parent = await prisma.category.findUnique({ where: { id: parentId } });
      if (!parent) {
        throw new NotFoundError('Parent category not found');
      }
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image,
        parentId,
      },
      include: {
        children: true,
      },
    });

    return category;
  }

  async getCategories(parentId?: string) {
    const categories = await prisma.category.findMany({
      where: parentId ? { parentId } : { parentId: null },
      include: {
        children: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return categories;
  }

  async getCategoryTree() {
    const rootCategories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return rootCategories;
  }

  async getCategoryById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        products: true,
      },
    });

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    return category;
  }

  async updateCategory(id: string, name?: string, description?: string, image?: string, parentId?: string) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    // Check if new slug conflicts
    if (name && name !== category.name) {
      const newSlug = generateSlug(name);
      const existing = await prisma.category.findUnique({
        where: { slug: newSlug },
      });
      if (existing && existing.id !== id) {
        throw new ConflictError('Category with this name already exists');
      }
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name, slug: generateSlug(name) }),
        description,
        image,
        parentId,
      },
      include: { children: true },
    });

    return updated;
  }

  async deleteCategory(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    if (category.products.length > 0) {
      throw new ValidationError('Cannot delete category with products');
    }

    await prisma.category.delete({ where: { id } });
    return { message: 'Category deleted successfully' };
  }
}

export const categoryService = new CategoryService();
