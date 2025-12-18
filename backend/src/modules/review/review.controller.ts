import { Request, Response } from 'express';
import reviewService from './review.service.js';
import { asyncHandler } from '../../core/middleware/error.js';

export class ReviewController {
  /**
   * POST /api/review
   * Create a new review
   */
  createReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { productId, rating, title, comment } = req.body;
    const userId = (req as any).user.id;

    if (!productId) {
      res.status(400).json({ error: 'Product ID is required' });
      return;
    }

    if (rating === undefined) {
      res.status(400).json({ error: 'Rating is required' });
      return;
    }

    const review = await reviewService.createReview(userId, productId, {
      rating,
      title,
      comment,
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully. Awaiting approval.',
      data: review,
    });
  });

  /**
   * GET /api/review/product/:productId
   * Get product reviews
   */
  getProductReviews = asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await reviewService.getProductReviews(productId, limit, offset);

    res.status(200).json({
      success: true,
      data: result.reviews,
      pagination: {
        total: result.total,
        limit,
        offset,
        hasMore: result.hasMore,
      },
    });
  });

  /**
   * GET /api/review/user
   * Get user's reviews
   */
  getUserReviews = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const reviews = await reviewService.getUserReviews(userId);

    res.status(200).json({
      success: true,
      data: reviews,
    });
  });

  /**
   * GET /api/review/:reviewId
   * Get review by ID
   */
  getReviewById = asyncHandler(async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const review = await reviewService.getReviewById(reviewId);

    res.status(200).json({
      success: true,
      data: review,
    });
  });

  /**
   * PUT /api/review/:reviewId
   * Update review
   */
  updateReview = asyncHandler(async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const { rating, title, comment } = req.body;
    const userId = (req as any).user.id;

    const review = await reviewService.updateReview(userId, reviewId, {
      rating,
      title,
      comment,
    });

    res.status(200).json({
      success: true,
      message: 'Review updated successfully. Awaiting re-approval.',
      data: review,
    });
  });

  /**
   * DELETE /api/review/:reviewId
   * Delete review
   */
  deleteReview = asyncHandler(async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const userId = (req as any).user.id;

    const result = await reviewService.deleteReview(userId, reviewId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  });

  /**
   * GET /api/review/product/:productId/summary
   * Get product rating summary
   */
  getProductRatingSummary = asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const summary = await reviewService.getProductRatingSummary(productId);

    res.status(200).json({
      success: true,
      data: summary,
    });
  });

  /**
   * PATCH /api/review/admin/:reviewId/approve
   * Approve review (admin only)
   */
  approveReview = asyncHandler(async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const review = await reviewService.approveReview(reviewId);

    res.status(200).json({
      success: true,
      message: 'Review approved successfully',
      data: review,
    });
  });

  /**
   * DELETE /api/review/admin/:reviewId
   * Reject review (admin only)
   */
  rejectReview = asyncHandler(async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const result = await reviewService.rejectReview(reviewId);

    res.status(200).json({
      success: true,
      message: 'Review rejected and deleted',
    });
  });

  /**
   * GET /api/review/admin/pending
   * Get pending reviews (admin only)
   */
  getPendingReviews = asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await reviewService.getPendingReviews(limit, offset);

    res.status(200).json({
      success: true,
      data: result.reviews,
      pagination: {
        total: result.total,
        limit,
        offset,
        hasMore: result.hasMore,
      },
    });
  });
}

export default new ReviewController();
