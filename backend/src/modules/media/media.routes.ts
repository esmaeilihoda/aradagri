import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { config } from '../../core/config/index.js';
import { mediaController } from './media.controller.js';
import { authMiddleware, adminOnly } from '../../core/middleware/auth.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (config.allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.maxFileSize },
});

const router = Router();

/**
 * @swagger
 * /media:
 *   get:
 *     tags:
 *       - Media
 *     summary: Get all media files (Admin only)
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
 *         description: Media files list
 *   post:
 *     tags:
 *       - Media
 *     summary: Upload media file (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded
 */
router.get('/', authMiddleware, adminOnly, mediaController.getAll);
router.post('/', authMiddleware, adminOnly, upload.single('file'), mediaController.upload);

/**
 * @swagger
 * /media/{id}:
 *   get:
 *     tags:
 *       - Media
 *     summary: Get media file by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Media file details
 *   delete:
 *     tags:
 *       - Media
 *     summary: Delete media file (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Media file deleted
 */
router.get('/:id', mediaController.getById);
router.delete('/:id', authMiddleware, adminOnly, mediaController.delete);

export default router;
