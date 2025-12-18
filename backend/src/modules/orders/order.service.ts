import { PrismaClient, OrderStatus } from '@prisma/client';
import { NotFoundError, ValidationError } from '../../core/utils/errors.js';
import { getPaginationParams } from '../../core/utils/helpers.js';

const prisma = new PrismaClient();

export class OrderService {
  async createOrderFromCart(userId: string, cartId: string) {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: { include: { product: true } } },
    });

    if (!cart) {
      throw new NotFoundError('Cart not found');
    }

    if (cart.items.length === 0) {
      throw new ValidationError('Cart is empty');
    }

    // Calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const itemTotal = item.product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      });

      // Update product stock
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: 'PENDING',
        items: {
          createMany: {
            data: orderItems,
          },
        },
      },
      include: {
        items: { include: { product: true } },
        user: true,
      },
    });

    // Clear cart
    await prisma.cartItem.deleteMany({ where: { cartId } });

    return order;
  }

  async getOrders(userId: string, page: number = 1, limit: number = 10) {
    const { skip, take } = getPaginationParams(page, limit);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        skip,
        take,
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    return {
      data: orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getOrderById(orderId: string, userId?: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } }, user: true },
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // Check if user owns the order
    if (userId && order.userId !== userId) {
      throw new NotFoundError('Order not found');
    }

    return order;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: { include: { product: true } } },
    });

    return updated;
  }

  async getAllOrders(page: number = 1, limit: number = 10, status?: OrderStatus) {
    const { skip, take } = getPaginationParams(page, limit);

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take,
        include: { items: { include: { product: true } }, user: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async cancelOrder(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    if (order.status === 'COMPLETED') {
      throw new ValidationError('Cannot cancel completed order');
    }

    // Restore stock
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
      include: { items: { include: { product: true } } },
    });

    return updated;
  }
}

export const orderService = new OrderService();
