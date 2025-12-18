import { Request, Response } from 'express';
import { orderService } from './order.service.js';
import { asyncHandler } from '../../core/middleware/error.js';

export class OrderController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const { cartId } = req.body;
    const order = await orderService.createOrderFromCart(req.userId!, cartId);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  });

  getMyOrders = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const result = await orderService.getOrders(
      req.userId!,
      parseInt(page as string),
      parseInt(limit as string)
    );

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  });

  getOrderById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await orderService.getOrderById(id, req.userId);

    res.status(200).json({
      success: true,
      data: order,
    });
  });

  // Admin endpoints
  getAllOrders = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, status } = req.query;
    const result = await orderService.getAllOrders(
      parseInt(page as string),
      parseInt(limit as string),
      status as any
    );

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  });

  updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await orderService.updateOrderStatus(id, status);

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      data: updated,
    });
  });

  cancelOrder = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updated = await orderService.cancelOrder(id);

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: updated,
    });
  });
}

export const orderController = new OrderController();
