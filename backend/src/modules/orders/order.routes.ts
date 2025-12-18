import { Router } from 'express';
import { orderController } from './order.controller.js';
import { authMiddleware, adminOnly } from '../../core/middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /orders:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Create order from cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cartId]
 *             properties:
 *               cartId: { type: string }
 *     responses:
 *       201:
 *         description: Order created
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get all orders (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema: { type: number }
 *       - name: limit
 *         in: query
 *         schema: { type: number }
 *       - name: status
 *         in: query
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Orders list
 */
router.post('/', authMiddleware, orderController.create);
router.get('/admin/all', authMiddleware, adminOnly, orderController.getAllOrders);

/**
 * @swagger
 * /orders/my:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get my orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema: { type: number }
 *       - name: limit
 *         in: query
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: My orders
 */
router.get('/my', authMiddleware, orderController.getMyOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get order by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order details
 *   put:
 *     tags:
 *       - Orders
 *     summary: Update order status (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [PENDING, PROCESSING, COMPLETED, CANCELLED] }
 *     responses:
 *       200:
 *         description: Order updated
 *   delete:
 *     tags:
 *       - Orders
 *     summary: Cancel order (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order cancelled
 */
router.get('/:id', authMiddleware, orderController.getOrderById);
router.put('/:id', authMiddleware, adminOnly, orderController.updateStatus);
router.delete('/:id', authMiddleware, adminOnly, orderController.cancelOrder);

export default router;
