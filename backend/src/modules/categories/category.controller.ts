import { Request, Response } from 'express';
import { categoryService } from './category.service.js';
import { asyncHandler } from '../../core/middleware/error.js';

export class CategoryController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const { name, parentId, description, image } = req.body;
    const category = await categoryService.createCategory(name, parentId, description, image);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { parentId } = req.query;
    const categories = await categoryService.getCategories(parentId as string);

    res.status(200).json({
      success: true,
      data: categories,
    });
  });

  getTree = asyncHandler(async (req: Request, res: Response) => {
    const tree = await categoryService.getCategoryTree();

    res.status(200).json({
      success: true,
      data: tree,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);

    res.status(200).json({
      success: true,
      data: category,
    });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, image, parentId } = req.body;
    const updated = await categoryService.updateCategory(id, name, description, image, parentId);

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: updated,
    });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await categoryService.deleteCategory(id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  });
}

export const categoryController = new CategoryController();
