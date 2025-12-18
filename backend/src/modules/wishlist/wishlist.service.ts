import { prisma } from '../../core/database/prisma.js';
import { ApiError } from '../../core/utils/errors.js';

export class WishlistService {
  /**
   * Add product to wishlist
   */
  async addToWishlist(userId: string, productId: string) {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    // Check if already in wishlist
    const existingWishlist = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingWishlist) {
      throw new ApiError(409, 'Product already in wishlist');
    }

    return await prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  /**
   * Get user's wishlist
   */
  async getWishlist(userId: string) {
    return await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Check if product is in wishlist
   */
  async isInWishlist(userId: string, productId: string) {
    const wishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return !!wishlistItem;
  }

  /**
   * Remove product from wishlist
   */
  async removeFromWishlist(userId: string, productId: string) {
    const wishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!wishlistItem) {
      throw new ApiError(404, 'Item not found in wishlist');
    }

    await prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return { message: 'Removed from wishlist successfully' };
  }

  /**
   * Clear entire wishlist
   */
  async clearWishlist(userId: string) {
    await prisma.wishlist.deleteMany({
      where: { userId },
    });

    return { message: 'Wishlist cleared successfully' };
  }

  /**
   * Get wishlist count
   */
  async getWishlistCount(userId: string) {
    const count = await prisma.wishlist.count({
      where: { userId },
    });

    return { count };
  }
}

export default new WishlistService();
