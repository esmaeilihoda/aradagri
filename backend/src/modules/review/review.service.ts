import { prisma } from '../../core/database/prisma.js';
import { ApiError } from '../../core/utils/errors.js';

export class ReviewService {
  /**
   * Create a new review
   */
  async createReview(userId: string, productId: string, data: { rating: number; title?: string; comment?: string }) {
    // Validate rating
    if (data.rating < 1 || data.rating > 5 || !Number.isInteger(data.rating)) {
      throw new ApiError(400, 'Rating must be an integer between 1 and 5');
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingReview) {
      throw new ApiError(409, 'You have already reviewed this product');
    }

    // Validate comment length
    if (data.comment && data.comment.length > 1000) {
      throw new ApiError(400, 'Comment must be less than 1000 characters');
    }

    return await prisma.review.create({
      data: {
        userId,
        productId,
        rating: data.rating,
        title: data.title,
        comment: data.comment,
        isApproved: false, // Require moderation by default
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  /**
   * Get product reviews (only approved)
   */
  async getProductReviews(productId: string, limit = 10, offset = 0) {
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          productId,
          isApproved: true,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      prisma.review.count({
        where: {
          productId,
          isApproved: true,
        },
      }),
    ]);

    return {
      reviews,
      total,
      hasMore: offset + limit < total,
    };
  }

  /**
   * Get user's reviews
   */
  async getUserReviews(userId: string) {
    return await prisma.review.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get review by ID
   */
  async getReviewById(reviewId: string) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    return review;
  }

  /**
   * Update review
   */
  async updateReview(
    userId: string,
    reviewId: string,
    data: { rating?: number; title?: string; comment?: string }
  ) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    if (review.userId !== userId) {
      throw new ApiError(403, 'You can only edit your own reviews');
    }

    // Validate rating if provided
    if (data.rating && (data.rating < 1 || data.rating > 5 || !Number.isInteger(data.rating))) {
      throw new ApiError(400, 'Rating must be an integer between 1 and 5');
    }

    // Validate comment length if provided
    if (data.comment && data.comment.length > 1000) {
      throw new ApiError(400, 'Comment must be less than 1000 characters');
    }

    return await prisma.review.update({
      where: { id: reviewId },
      data: {
        ...data,
        isApproved: false, // Reset approval status
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  /**
   * Delete review
   */
  async deleteReview(userId: string, reviewId: string) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    if (review.userId !== userId) {
      throw new ApiError(403, 'You can only delete your own reviews');
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    return { message: 'Review deleted successfully' };
  }

  /**
   * Get product rating summary
   */
  async getProductRatingSummary(productId: string) {
    const reviews = await prisma.review.findMany({
      where: {
        productId,
        isApproved: true,
      },
      select: {
        rating: true,
      },
    });

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
      };
    }

    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRating = 0;

    reviews.forEach((review: { rating: number }) => {
      totalRating += review.rating;
      ratingDistribution[review.rating as 1 | 2 | 3 | 4 | 5]++;
    });

    return {
      averageRating: parseFloat((totalRating / reviews.length).toFixed(1)),
      totalReviews: reviews.length,
      ratingDistribution,
    };
  }

  /**
   * Approve review (admin only)
   */
  async approveReview(reviewId: string) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    return await prisma.review.update({
      where: { id: reviewId },
      data: {
        isApproved: true,
      },
    });
  }

  /**
   * Reject review (admin only)
   */
  async rejectReview(reviewId: string) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    return await prisma.review.delete({
      where: { id: reviewId },
    });
  }

  /**
   * Get pending reviews (admin only)
   */
  async getPendingReviews(limit = 10, offset = 0) {
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          isApproved: false,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          product: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
        take: limit,
        skip: offset,
      }),
      prisma.review.count({
        where: {
          isApproved: false,
        },
      }),
    ]);

    return {
      reviews,
      total,
      hasMore: offset + limit < total,
    };
  }
}

export default new ReviewService();
