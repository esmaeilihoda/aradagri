import { Request, Response } from 'express';
import { cartService } from './cart.service.js';
import { asyncHandler } from '../../core/middleware/error.js';

export class CartController {
  getCart = asyncHandler(async (req: Request, res: Response) => {
    const { guestToken } = req.query;
    const cart = await cartService.getOrCreateCart(req.userId, guestToken as string);

    res.status(200).json({
      success: true,
      data: cart,
    });
  });

  addToCart = asyncHandler(async (req: Request, res: Response) => {
    let { cartId } = req.params;
    const { productId, quantity } = req.body;

    // If user is logged in and no cart, get/create their cart
    if (req.userId && !cartId) {
      const cart = await cartService.getOrCreateCart(req.userId);
      if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found' });
      }
      cartId = cart.id;
    }

    const item = await cartService.addToCart(cartId, productId, quantity);

    return res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: item,
    });
  });

  updateItem = asyncHandler(async (req: Request, res: Response) => {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const updated = await cartService.updateCartItem(itemId, quantity);

    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      data: updated,
    });
  });

  removeItem = asyncHandler(async (req: Request, res: Response) => {
    const { itemId } = req.params;
    const result = await cartService.removeFromCart(itemId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  });

  getTotal = asyncHandler(async (req: Request, res: Response) => {
    const { cartId } = req.params;
    const result = await cartService.getCartTotal(cartId);

    res.status(200).json({
      success: true,
      data: result,
    });
  });

  clear = asyncHandler(async (req: Request, res: Response) => {
    const { cartId } = req.params;
    const result = await cartService.clearCart(cartId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  });

  mergeCart = asyncHandler(async (req: Request, res: Response) => {
    const { guestToken } = req.body;
    const cart = await cartService.mergeGuestCart(guestToken, req.userId!);

    res.status(200).json({
      success: true,
      message: 'Guest cart merged successfully',
      data: cart,
    });
  });
}

export const cartController = new CartController();
