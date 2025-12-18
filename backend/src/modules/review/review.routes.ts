import express from 'express';
import reviewController from './review.controller.js';
import { authMiddleware, adminOnly } from '../../core/middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Reviews
 *     description: Product reviews and ratings
 */

/**
 * @swagger
 * /api/review:
 *   post:
 *     tags: [Reviews]
 *     summary: Create a review
 *     description: Submit a new product review (requires authentication)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - rating
 *             properties:
 *               productId:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               title:
 *                 type: string
 *               comment:
 *                 type: string
 *                 maxLength: 1000
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found
 *       409:
 *         description: User already reviewed this product
 *     security:
 *       - BearerAuth: []
 */
router.post('/', authMiddleware, reviewController.createReview);

/**
 * @swagger
 * /api/review/product/{productId}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get product reviews
 *     description: Get approved reviews for a product
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 */
router.get('/product/:productId', reviewController.getProductReviews);

/**
 * @swagger
 * /api/review/product/{productId}/summary:
 *   get:
 *     tags: [Reviews]
 *     summary: Get product rating summary
 *     description: Get average rating and rating distribution for a product
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rating summary retrieved successfully
 */
router.get('/product/:productId/summary', reviewController.getProductRatingSummary);

/**
 * @swagger
 * /api/review/user:
 *   get:
 *     tags: [Reviews]
 *     summary: Get user's reviews
 *     description: Get all reviews submitted by the authenticated user
 *     responses:
 *       200:
 *         description: User reviews retrieved successfully
 *     security:
 *       - BearerAuth: []
 */
router.get('/user', authMiddleware, reviewController.getUserReviews);

/**
 * @swagger
 * /api/review/{reviewId}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get review by ID
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review retrieved successfully
 *       404:
 *         description: Review not found
 */
router.get('/:reviewId', reviewController.getReviewById);

/**
 * @swagger
 * /api/review/{reviewId}:
 *   put:
 *     tags: [Reviews]
 *     summary: Update a review
 *     description: Update a review submitted by the authenticated user
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               title:
 *                 type: string
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       403:
 *         description: Can only edit your own reviews
 *       404:
 *         description: Review not found
 *     security:
 *       - BearerAuth: []
 */
router.put('/:reviewId', authMiddleware, reviewController.updateReview);

/**
 * @swagger
 * /api/review/{reviewId}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Delete a review
 *     description: Delete a review submitted by the authenticated user
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       403:
 *         description: Can only delete your own reviews
 *       404:
 *         description: Review not found
 *     security:
 *       - BearerAuth: []
 */
router.delete('/:reviewId', authMiddleware, reviewController.deleteReview);

// Admin routes
/**
 * @swagger
 * /api/review/admin/pending:
 *   get:
 *     tags: [Reviews]
 *     summary: Get pending reviews (admin only)
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Pending reviews retrieved successfully
 *     security:
 *       - BearerAuth: []
 */
router.get('/admin/pending', authMiddleware, adminOnly, reviewController.getPendingReviews);

/**
 * @swagger
 * /api/review/admin/{reviewId}/approve:
 *   patch:
 *     tags: [Reviews]
 *     summary: Approve a review (admin only)
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review approved successfully
 *       404:
 *         description: Review not found
 *     security:
 *       - BearerAuth: []
 */
router.patch('/admin/:reviewId/approve', authMiddleware, adminOnly, reviewController.approveReview);

/**
 * @swagger
 * /api/review/admin/{reviewId}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Reject a review (admin only)
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review rejected successfully
 *       404:
 *         description: Review not found
 *     security:
 *       - BearerAuth: []
 */
router.delete('/admin/:reviewId', authMiddleware, adminOnly, reviewController.rejectReview);

export default router;
