import { PrismaClient, ServiceType } from '@prisma/client';
import { NotFoundError, ValidationError } from '../../core/utils/errors.js';

const prisma = new PrismaClient();

export class ServiceService {
  async createService(title: string, type: ServiceType, description: string, image?: string) {
    const service = await prisma.service.create({
      data: { title, type, description, image },
    });

    return service;
  }

  async getServices(type?: ServiceType) {
    const services = await prisma.service.findMany({
      where: type ? { type } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return services;
  }

  async getServiceById(id: string) {
    const service = await prisma.service.findUnique({ where: { id } });

    if (!service) {
      throw new NotFoundError('Service not found');
    }

    return service;
  }

  async updateService(
    id: string,
    title?: string,
    type?: ServiceType,
    description?: string,
    image?: string
  ) {
    const service = await prisma.service.findUnique({ where: { id } });

    if (!service) {
      throw new NotFoundError('Service not found');
    }

    const updated = await prisma.service.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(type && { type }),
        ...(description && { description }),
        ...(image !== undefined && { image }),
      },
    });

    return updated;
  }

  async deleteService(id: string) {
    const service = await prisma.service.findUnique({ where: { id } });

    if (!service) {
      throw new NotFoundError('Service not found');
    }

    await prisma.service.delete({ where: { id } });
    return { message: 'Service deleted successfully' };
  }
}

export const serviceService = new ServiceService();
