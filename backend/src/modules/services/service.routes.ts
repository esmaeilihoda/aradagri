import { Router } from 'express';
import { serviceController } from './service.controller.js';
import { authMiddleware, adminOnly } from '../../core/middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /services:
 *   get:
 *     tags:
 *       - Services
 *     summary: Get all services
 *     parameters:
 *       - name: type
 *         in: query
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Services list
 *   post:
 *     tags:
 *       - Services
 *     summary: Create service (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, type, description]
 *             properties:
 *               title: { type: string }
 *               type: { type: string, enum: [GREENHOUSE, AGRICULTURAL_STRUCTURE, LANDSCAPING_VILLA, LEGAL_CONSULTATION, AI_AGRICULTURE] }
 *               description: { type: string }
 *               image: { type: string }
 *     responses:
 *       201:
 *         description: Service created
 */
router.get('/', serviceController.getAll);
router.post('/', authMiddleware, adminOnly, serviceController.create);

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     tags:
 *       - Services
 *     summary: Get service by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Service details
 *   put:
 *     tags:
 *       - Services
 *     summary: Update service (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               type: { type: string }
 *               description: { type: string }
 *               image: { type: string }
 *     responses:
 *       200:
 *         description: Service updated
 *   delete:
 *     tags:
 *       - Services
 *     summary: Delete service (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Service deleted
 */
router.get('/:id', serviceController.getById);
router.put('/:id', authMiddleware, adminOnly, serviceController.update);
router.delete('/:id', authMiddleware, adminOnly, serviceController.delete);

export default router;
