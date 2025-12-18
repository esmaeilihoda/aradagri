import { prisma } from '../../core/database/prisma.js';
import { ValidationError, NotFoundError, ForbiddenError } from '../../core/utils/errors.js';

export class AddressService {
  async createAddress(
    userId: string,
    data: {
      title: string;
      fullName: string;
      phone: string;
      province: string;
      city: string;
      postalCode: string;
      street: string;
      isDefault?: boolean;
    }
  ) {
    // Validation
    if (!data.title || !data.fullName || !data.phone || !data.province || !data.city || !data.postalCode || !data.street) {
      throw new ValidationError('All address fields are required');
    }

    if (!/^\d{10,11}$/.test(data.phone.replace(/\D/g, ''))) {
      throw new ValidationError('Invalid phone number');
    }

    if (!/^\d{10}$/.test(data.postalCode.replace(/\D/g, ''))) {
      throw new ValidationError('Invalid postal code');
    }

    // If this is the default, unset other defaults
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        title: data.title,
        fullName: data.fullName,
        phone: data.phone,
        province: data.province,
        city: data.city,
        postalCode: data.postalCode,
        street: data.street,
        isDefault: data.isDefault || false,
      },
    });

    return address;
  }

  async getAddresses(userId: string) {
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    return addresses;
  }

  async getAddressById(userId: string, addressId: string) {
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundError('Address not found');
    }

    if (address.userId !== userId) {
      throw new ForbiddenError('You do not have permission to access this address');
    }

    return address;
  }

  async updateAddress(
    userId: string,
    addressId: string,
    data: {
      title?: string;
      fullName?: string;
      phone?: string;
      province?: string;
      city?: string;
      postalCode?: string;
      street?: string;
      isDefault?: boolean;
    }
  ) {
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundError('Address not found');
    }

    if (address.userId !== userId) {
      throw new ForbiddenError('You do not have permission to update this address');
    }

    // Validation
    if (data.phone && !/^\d{10,11}$/.test(data.phone.replace(/\D/g, ''))) {
      throw new ValidationError('Invalid phone number');
    }

    if (data.postalCode && !/^\d{10}$/.test(data.postalCode.replace(/\D/g, ''))) {
      throw new ValidationError('Invalid postal code');
    }

    // If setting as default, unset other defaults
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, id: { not: addressId } },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data,
    });

    return updatedAddress;
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundError('Address not found');
    }

    if (address.userId !== userId) {
      throw new ForbiddenError('You do not have permission to delete this address');
    }

    const deletedAddress = await prisma.address.delete({
      where: { id: addressId },
    });

    // If deleted address was default, set another as default
    if (deletedAddress.isDefault) {
      const firstAddress = await prisma.address.findFirst({
        where: { userId },
        orderBy: { createdAt: 'asc' },
      });

      if (firstAddress) {
        await prisma.address.update({
          where: { id: firstAddress.id },
          data: { isDefault: true },
        });
      }
    }

    return deletedAddress;
  }

  async setDefaultAddress(userId: string, addressId: string) {
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundError('Address not found');
    }

    if (address.userId !== userId) {
      throw new ForbiddenError('You do not have permission to update this address');
    }

    // Unset other defaults
    await prisma.address.updateMany({
      where: { userId, id: { not: addressId } },
      data: { isDefault: false },
    });

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });

    return updatedAddress;
  }
}

export const addressService = new AddressService();
