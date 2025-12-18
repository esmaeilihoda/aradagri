import { prisma } from '../../core/database/prisma.js';
import { v4 as uuidv4 } from 'uuid';
import { ValidationError, NotFoundError } from '../../core/utils/errors.js';

export class CartService {
  async getOrCreateCart(userId?: string, guestToken?: string) {
    if (userId) {
      let cart = await prisma.cart.findFirst({
        where: { userId },
        include: { items: { include: { product: true } } },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId },
          include: { items: { include: { product: true } } },
        });
      }

      return cart;
    } else if (guestToken) {
      return prisma.cart.findUnique({
        where: { guestToken },
        include: { items: { include: { product: true } } },
      });
    } else {
      // Create new guest cart
      const newGuestToken = uuidv4();
      return prisma.cart.create({
        data: { guestToken: newGuestToken },
        include: { items: { include: { product: true } } },
      });
    }
  }

  async addToCart(cartId: string, productId: string, quantity: number) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (quantity <= 0) {
      throw new ValidationError('Quantity must be greater than 0');
    }

    let cartItem = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId, productId } },
    });

    if (cartItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: cartItem.quantity + quantity },
        include: { product: true },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: { cartId, productId, quantity },
        include: { product: true },
      });
    }

    return cartItem;
  }

  async updateCartItem(cartItemId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeFromCart(cartItemId);
    }

    const updated = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: { product: true },
    });

    return updated;
  }

  async removeFromCart(cartItemId: string) {
    await prisma.cartItem.delete({ where: { id: cartItemId } });
    return { message: 'Item removed from cart' };
  }

  async getCartTotal(cartId: string) {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: { include: { product: true } } },
    });

    if (!cart) {
      throw new NotFoundError('Cart not found');
    }

    const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0);

    return {
      cart,
      total,
      itemCount,
      items: cart.items,
    };
  }

  async clearCart(cartId: string) {
    await prisma.cartItem.deleteMany({ where: { cartId } });
    return { message: 'Cart cleared successfully' };
  }

  async mergeGuestCart(guestToken: string, userId: string) {
    const guestCart = await prisma.cart.findUnique({
      where: { guestToken },
      include: { items: true },
    });

    if (!guestCart) {
      throw new NotFoundError('Guest cart not found');
    }

    const userCart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!userCart) {
      // Update guest cart to user cart
      return prisma.cart.update({
        where: { id: guestCart.id },
        data: { userId, guestToken: null },
        include: { items: { include: { product: true } } },
      });
    }

    // Merge items
    for (const item of guestCart.items) {
      const existing = await prisma.cartItem.findUnique({
        where: { cartId_productId: { cartId: userCart.id, productId: item.productId } },
      });

      if (existing) {
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + item.quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            productId: item.productId,
            quantity: item.quantity,
          },
        });
      }
    }

    // Delete guest cart
    await prisma.cart.delete({ where: { id: guestCart.id } });

    return prisma.cart.findUnique({
      where: { id: userCart.id },
      include: { items: { include: { product: true } } },
    });
  }
}

export const cartService = new CartService();
