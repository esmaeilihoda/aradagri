import { Request, Response } from 'express';
import { serviceService } from './service.service.js';
import { asyncHandler } from '../../core/middleware/error.js';

export class ServiceController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const { title, type, description, image } = req.body;
    const service = await serviceService.createService(title, type, description, image);

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service,
    });
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { type } = req.query;
    const services = await serviceService.getServices(type as any);

    res.status(200).json({
      success: true,
      data: services,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const service = await serviceService.getServiceById(id);

    res.status(200).json({
      success: true,
      data: service,
    });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, type, description, image } = req.body;
    const updated = await serviceService.updateService(id, title, type, description, image);

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: updated,
    });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await serviceService.deleteService(id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  });
}

export const serviceController = new ServiceController();
