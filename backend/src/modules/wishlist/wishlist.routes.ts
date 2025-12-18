import express from 'express';
import wishlistController from './wishlist.controller.js';
import { authMiddleware } from '../../core/middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   - name: Wishlist
 *     description: User wishlist management
 */

/**
 * @swagger
 * /api/wishlist/add:
 *   post:
 *     tags: [Wishlist]
 *     summary: Add product to wishlist
 *     description: Add a product to the authenticated user's wishlist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 description: Product ID to add
 *     responses:
 *       201:
 *         description: Successfully added to wishlist
 *       400:
 *         description: Invalid product ID
 *       404:
 *         description: Product not found
 *       409:
 *         description: Product already in wishlist
 *     security:
 *       - BearerAuth: []
 */
router.post('/add', wishlistController.addToWishlist);

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     tags: [Wishlist]
 *     summary: Get user's wishlist
 *     description: Retrieve all products in the authenticated user's wishlist
 *     responses:
 *       200:
 *         description: Successfully retrieved wishlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       productId:
 *                         type: string
 *                       product:
 *                         type: object
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 count:
 *                   type: number
 *     security:
 *       - BearerAuth: []
 */
router.get('/', wishlistController.getWishlist);

/**
 * @swagger
 * /api/wishlist/check/{productId}:
 *   get:
 *     tags: [Wishlist]
 *     summary: Check if product is in wishlist
 *     description: Check if a product is in the authenticated user's wishlist
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to check
 *     responses:
 *       200:
 *         description: Successfully checked product status
 *     security:
 *       - BearerAuth: []
 */
router.get('/check/:productId', wishlistController.checkInWishlist);

/**
 * @swagger
 * /api/wishlist/{productId}:
 *   delete:
 *     tags: [Wishlist]
 *     summary: Remove product from wishlist
 *     description: Remove a product from the authenticated user's wishlist
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to remove
 *     responses:
 *       200:
 *         description: Successfully removed from wishlist
 *       404:
 *         description: Item not found in wishlist
 *     security:
 *       - BearerAuth: []
 */
router.delete('/:productId', wishlistController.removeFromWishlist);

/**
 * @swagger
 * /api/wishlist:
 *   delete:
 *     tags: [Wishlist]
 *     summary: Clear entire wishlist
 *     description: Remove all products from the authenticated user's wishlist
 *     responses:
 *       200:
 *         description: Successfully cleared wishlist
 *     security:
 *       - BearerAuth: []
 */
router.delete('/', wishlistController.clearWishlist);

/**
 * @swagger
 * /api/wishlist/count:
 *   get:
 *     tags: [Wishlist]
 *     summary: Get wishlist item count
 *     description: Get the number of items in the authenticated user's wishlist
 *     responses:
 *       200:
 *         description: Successfully retrieved count
 *     security:
 *       - BearerAuth: []
 */
router.get('/count', wishlistController.getWishlistCount);

export default router;
