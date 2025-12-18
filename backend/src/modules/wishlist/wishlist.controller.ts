import { Request, Response } from 'express';
import wishlistService from './wishlist.service.js';
import { asyncHandler } from '../../core/middleware/error.js';

export class WishlistController {
  /**
   * POST /api/wishlist/add
   * Add product to wishlist
   */
  addToWishlist = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { productId } = req.body;
    const userId = (req as any).user.id;

    if (!productId) {
      res.status(400).json({ error: 'Product ID is required' });
      return;
    }

    const wishlistItem = await wishlistService.addToWishlist(userId, productId);

    res.status(201).json({
      success: true,
      message: 'Added to wishlist successfully',
      data: wishlistItem,
    });
  });

  /**
   * GET /api/wishlist
   * Get user's wishlist
   */
  getWishlist = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const wishlistItems = await wishlistService.getWishlist(userId);

    res.status(200).json({
      success: true,
      data: wishlistItems,
      count: wishlistItems.length,
    });
  });

  /**
   * GET /api/wishlist/check/:productId
   * Check if product is in wishlist
   */
  checkInWishlist = asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const userId = (req as any).user.id;

    const isInWishlist = await wishlistService.isInWishlist(userId, productId);

    res.status(200).json({
      success: true,
      isInWishlist,
    });
  });

  /**
   * DELETE /api/wishlist/:productId
   * Remove product from wishlist
   */
  removeFromWishlist = asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const userId = (req as any).user.id;

    const result = await wishlistService.removeFromWishlist(userId, productId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  });

  /**
   * DELETE /api/wishlist
   * Clear entire wishlist
   */
  clearWishlist = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const result = await wishlistService.clearWishlist(userId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  });

  /**
   * GET /api/wishlist/count
   * Get wishlist count
   */
  getWishlistCount = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const result = await wishlistService.getWishlistCount(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  });
}

export default new WishlistController();
