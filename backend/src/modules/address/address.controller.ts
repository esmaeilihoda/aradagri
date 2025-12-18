import { Request, Response } from 'express';
import { addressService } from './address.service.js';
import { asyncHandler } from '../../core/middleware/error.js';

export class AddressController {
  createAddress = asyncHandler(async (req: Request, res: Response) => {
    const { title, fullName, phone, province, city, postalCode, street, isDefault } = req.body;
    const result = await addressService.createAddress(req.userId!, {
      title,
      fullName,
      phone,
      province,
      city,
      postalCode,
      street,
      isDefault,
    });

    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: result,
    });
  });

  getAddresses = asyncHandler(async (req: Request, res: Response) => {
    const result = await addressService.getAddresses(req.userId!);

    res.status(200).json({
      success: true,
      message: 'Addresses retrieved successfully',
      data: result,
    });
  });

  getAddressById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await addressService.getAddressById(req.userId!, id);

    res.status(200).json({
      success: true,
      message: 'Address retrieved successfully',
      data: result,
    });
  });

  updateAddress = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, fullName, phone, province, city, postalCode, street, isDefault } = req.body;
    const result = await addressService.updateAddress(req.userId!, id, {
      title,
      fullName,
      phone,
      province,
      city,
      postalCode,
      street,
      isDefault,
    });

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: result,
    });
  });

  deleteAddress = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await addressService.deleteAddress(req.userId!, id);

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      data: result,
    });
  });

  setDefaultAddress = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await addressService.setDefaultAddress(req.userId!, id);

    res.status(200).json({
      success: true,
      message: 'Default address set successfully',
      data: result,
    });
  });
}

export const addressController = new AddressController();
