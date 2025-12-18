import { Router } from 'express';
import { contactController } from './contact.controller.js';
import { authMiddleware, adminOnly } from '../../core/middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /contact:
 *   post:
 *     tags:
 *       - Contact
 *     summary: Submit contact form
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, phone, message]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               message: { type: string }
 *     responses:
 *       201:
 *         description: Message sent
 *   get:
 *     tags:
 *       - Contact
 *     summary: Get contact submissions (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema: { type: number }
 *       - name: limit
 *         in: query
 *         schema: { type: number }
 *       - name: read
 *         in: query
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: Submissions list
 */
router.post('/', contactController.submit);
router.get('/', authMiddleware, adminOnly, contactController.getSubmissions);

/**
 * @swagger
 * /contact/{id}:
 *   get:
 *     tags:
 *       - Contact
 *     summary: Get submission by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Submission details
 *   delete:
 *     tags:
 *       - Contact
 *     summary: Delete submission (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Submission deleted
 */
router.get('/:id', authMiddleware, adminOnly, contactController.getById);
router.delete('/:id', authMiddleware, adminOnly, contactController.delete);

export default router;
