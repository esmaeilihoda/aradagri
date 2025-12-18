import { Request, Response } from 'express';
import { productService } from './product.service.js';
import { asyncHandler } from '../../core/middleware/error.js';

export class ProductController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const { title, description, price, categoryId, stock, unit, images, attributes } = req.body;
    const product = await productService.createProduct(
      title,
      description,
      price,
      categoryId,
      stock,
      unit,
      images,
      attributes
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const {
      page = 1,
      limit = 10,
      categoryId,
      search,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const result = await productService.getProducts(
      parseInt(page as string),
      parseInt(limit as string),
      categoryId as string,
      search as string,
      minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice ? parseFloat(maxPrice as string) : undefined,
      sortBy as string,
      sortOrder as 'asc' | 'desc'
    );

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    res.status(200).json({
      success: true,
      data: product,
    });
  });

  getBySlug = asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const product = await productService.getProductBySlug(slug);

    res.status(200).json({
      success: true,
      data: product,
    });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, price, stock, unit, images, attributes } = req.body;
    const updated = await productService.updateProduct(
      id,
      title,
      description,
      price,
      stock,
      unit,
      images,
      attributes
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updated,
    });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await productService.deleteProduct(id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  });

  addImage = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { imageUrl } = req.body;
    const updated = await productService.addProductImage(id, imageUrl);

    res.status(200).json({
      success: true,
      message: 'Image added successfully',
      data: updated,
    });
  });

  removeImage = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { imageUrl } = req.body;
    const updated = await productService.removeProductImage(id, imageUrl);

    res.status(200).json({
      success: true,
      message: 'Image removed successfully',
      data: updated,
    });
  });
}

export const productController = new ProductController();
