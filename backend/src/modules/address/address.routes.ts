import { Router } from 'express';
import { addressController } from './address.controller.js';
import { authMiddleware } from '../../core/middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /address:
 *   post:
 *     tags:
 *       - Address
 *     summary: Create a new address
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, fullName, phoneNumber, province, city, postalCode, address]
 *             properties:
 *               title: { type: string, example: "Home" }
 *               fullName: { type: string }
 *               phoneNumber: { type: string }
 *               province: { type: string }
 *               city: { type: string }
 *               postalCode: { type: string }
 *               address: { type: string }
 *               isDefault: { type: boolean }
 *     responses:
 *       201:
 *         description: Address created successfully
 */
router.post('/', authMiddleware, addressController.createAddress);

/**
 * @swagger
 * /address:
 *   get:
 *     tags:
 *       - Address
 *     summary: Get all user addresses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Addresses retrieved successfully
 */
router.get('/', authMiddleware, addressController.getAddresses);

/**
 * @swagger
 * /address/{id}:
 *   get:
 *     tags:
 *       - Address
 *     summary: Get address by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Address retrieved successfully
 */
router.get('/:id', authMiddleware, addressController.getAddressById);

/**
 * @swagger
 * /address/{id}:
 *   put:
 *     tags:
 *       - Address
 *     summary: Update address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               fullName: { type: string }
 *               phoneNumber: { type: string }
 *               province: { type: string }
 *               city: { type: string }
 *               postalCode: { type: string }
 *               address: { type: string }
 *               isDefault: { type: boolean }
 *     responses:
 *       200:
 *         description: Address updated successfully
 */
router.put('/:id', authMiddleware, addressController.updateAddress);

/**
 * @swagger
 * /address/{id}:
 *   delete:
 *     tags:
 *       - Address
 *     summary: Delete address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Address deleted successfully
 */
router.delete('/:id', authMiddleware, addressController.deleteAddress);

/**
 * @swagger
 * /address/{id}/set-default:
 *   patch:
 *     tags:
 *       - Address
 *     summary: Set address as default
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Default address set successfully
 */
router.patch('/:id/set-default', authMiddleware, addressController.setDefaultAddress);

export default router;
