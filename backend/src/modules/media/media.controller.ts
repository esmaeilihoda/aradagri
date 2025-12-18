import { Request, Response } from 'express';
import { mediaService } from './media.service.js';
import { asyncHandler } from '../../core/middleware/error.js';
import path from 'path';
import fs from 'fs';
import { config } from '../../core/config/index.js';

export class MediaController {
  upload = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    const { filename, path: filePath, mimetype, size } = req.file;
    const url = `/uploads/${req.file.path.split(path.sep).pop()}`;

    const media = await mediaService.createMedia(filename, url, mimetype, size);

    return res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: media,
    });
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 20 } = req.query;
    const result = await mediaService.getMediaFiles(
      parseInt(page as string),
      parseInt(limit as string)
    );

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const media = await mediaService.getMediaById(id);

    res.status(200).json({
      success: true,
      data: media,
    });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const media = await mediaService.getMediaById(id);

    // Delete physical file
    const filePath = path.join(config.uploadDir, media.url.replace('/uploads/', ''));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const result = await mediaService.deleteMedia(id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  });
}

export const mediaController = new MediaController();
