import { Router } from 'express';
import { cartController } from './cart.controller.js';
import { authMiddleware } from '../../core/middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /cart:
 *   get:
 *     tags:
 *       - Cart
 *     summary: Get cart
 *     parameters:
 *       - name: guestToken
 *         in: query
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Cart details
 */
router.get('/', cartController.getCart);

/**
 * @swagger
 * /cart/{cartId}/items:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Add item to cart
 *     parameters:
 *       - name: cartId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, quantity]
 *             properties:
 *               productId: { type: string }
 *               quantity: { type: number }
 *     responses:
 *       200:
 *         description: Item added
 */
router.post('/:cartId/items', cartController.addToCart);

/**
 * @swagger
 * /cart/items/{itemId}:
 *   put:
 *     tags:
 *       - Cart
 *     summary: Update cart item quantity
 *     parameters:
 *       - name: itemId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity: { type: number }
 *     responses:
 *       200:
 *         description: Item updated
 *   delete:
 *     tags:
 *       - Cart
 *     summary: Remove item from cart
 *     parameters:
 *       - name: itemId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Item removed
 */
router.put('/items/:itemId', cartController.updateItem);
router.delete('/items/:itemId', cartController.removeItem);

/**
 * @swagger
 * /cart/{cartId}/total:
 *   get:
 *     tags:
 *       - Cart
 *     summary: Get cart total
 *     parameters:
 *       - name: cartId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Cart total
 */
router.get('/:cartId/total', cartController.getTotal);

/**
 * @swagger
 * /cart/{cartId}/clear:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Clear cart
 *     parameters:
 *       - name: cartId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Cart cleared
 */
router.post('/:cartId/clear', cartController.clear);

/**
 * @swagger
 * /cart/merge:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Merge guest cart to user cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [guestToken]
 *             properties:
 *               guestToken: { type: string }
 *     responses:
 *       200:
 *         description: Cart merged
 */
router.post('/merge', authMiddleware, cartController.mergeCart);

export default router;
