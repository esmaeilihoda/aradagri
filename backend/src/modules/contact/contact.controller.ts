import { Request, Response } from 'express';
import { contactService } from './contact.service.js';
import { asyncHandler } from '../../core/middleware/error.js';

export class ContactController {
  submit = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, phone, message } = req.body;
    const submission = await contactService.createSubmission(name, email, phone, message);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully. We will contact you soon.',
      data: submission,
    });
  });

  getSubmissions = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, read } = req.query;
    const result = await contactService.getSubmissions(
      parseInt(page as string),
      parseInt(limit as string),
      read === 'true' ? true : read === 'false' ? false : undefined
    );

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const submission = await contactService.getSubmissionById(id);

    res.status(200).json({
      success: true,
      data: submission,
    });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await contactService.deleteSubmission(id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  });
}

export const contactController = new ContactController();
