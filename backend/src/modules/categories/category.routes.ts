import { Router } from 'express';
import { categoryController } from './category.controller.js';
import { authMiddleware, adminOnly } from '../../core/middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get all categories
 *     parameters:
 *       - name: parentId
 *         in: query
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Categories list
 *   post:
 *     tags:
 *       - Categories
 *     summary: Create category (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               parentId: { type: string }
 *               description: { type: string }
 *               image: { type: string }
 *     responses:
 *       201:
 *         description: Category created
 */
router.get('/', categoryController.getAll);
router.post('/', authMiddleware, adminOnly, categoryController.create);

/**
 * @swagger
 * /categories/tree:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get category tree structure
 *     responses:
 *       200:
 *         description: Category tree
 */
router.get('/tree', categoryController.getTree);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get category by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Category details
 *   put:
 *     tags:
 *       - Categories
 *     summary: Update category (Admin only)
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
 *               name: { type: string }
 *               description: { type: string }
 *               image: { type: string }
 *               parentId: { type: string }
 *     responses:
 *       200:
 *         description: Category updated
 *   delete:
 *     tags:
 *       - Categories
 *     summary: Delete category (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Category deleted
 */
router.get('/:id', categoryController.getById);
router.put('/:id', authMiddleware, adminOnly, categoryController.update);
router.delete('/:id', authMiddleware, adminOnly, categoryController.delete);

export default router;
