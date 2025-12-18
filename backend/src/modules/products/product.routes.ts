import { Router } from 'express';
import { productController } from './product.controller.js';
import { authMiddleware, adminOnly } from '../../core/middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get all products with filters
 *     parameters:
 *       - name: page
 *         in: query
 *         schema: { type: number }
 *       - name: limit
 *         in: query
 *         schema: { type: number }
 *       - name: categoryId
 *         in: query
 *         schema: { type: string }
 *       - name: search
 *         in: query
 *         schema: { type: string }
 *       - name: minPrice
 *         in: query
 *         schema: { type: number }
 *       - name: maxPrice
 *         in: query
 *         schema: { type: number }
 *       - name: sortBy
 *         in: query
 *         schema: { type: string }
 *       - name: sortOrder
 *         in: query
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200:
 *         description: Products list
 *   post:
 *     tags:
 *       - Products
 *     summary: Create product (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, price, categoryId]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               categoryId: { type: string }
 *               stock: { type: number }
 *               unit: { type: string }
 *               images: { type: array, items: { type: string } }
 *               attributes: { type: object }
 *     responses:
 *       201:
 *         description: Product created
 */
router.get('/', productController.getAll);
router.post('/', authMiddleware, adminOnly, productController.create);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get product by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product details
 *   put:
 *     tags:
 *       - Products
 *     summary: Update product (Admin only)
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
 *               description: { type: string }
 *               price: { type: number }
 *               stock: { type: number }
 *               unit: { type: string }
 *               images: { type: array, items: { type: string } }
 *               attributes: { type: object }
 *     responses:
 *       200:
 *         description: Product updated
 *   delete:
 *     tags:
 *       - Products
 *     summary: Delete product (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product deleted
 */
router.get('/:id', productController.getById);
router.put('/:id', authMiddleware, adminOnly, productController.update);
router.delete('/:id', authMiddleware, adminOnly, productController.delete);

/**
 * @swagger
 * /products/{id}/images:
 *   post:
 *     tags:
 *       - Products
 *     summary: Add image to product
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
 *             required: [imageUrl]
 *             properties:
 *               imageUrl: { type: string }
 *     responses:
 *       200:
 *         description: Image added
 *   delete:
 *     tags:
 *       - Products
 *     summary: Remove image from product
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
 *             required: [imageUrl]
 *             properties:
 *               imageUrl: { type: string }
 *     responses:
 *       200:
 *         description: Image removed
 */
router.post('/:id/images', authMiddleware, adminOnly, productController.addImage);
router.delete('/:id/images', authMiddleware, adminOnly, productController.removeImage);

export default router;
