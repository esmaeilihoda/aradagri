import { PrismaClient } from '@prisma/client';
import { validateEmail } from '../../core/utils/helpers.js';
import { ValidationError, NotFoundError } from '../../core/utils/errors.js';
import { getPaginationParams } from '../../core/utils/helpers.js';

const prisma = new PrismaClient();

export class ContactService {
  async createSubmission(name: string, email: string, phone: string, message: string) {
    if (!validateEmail(email)) {
      throw new ValidationError('Invalid email format');
    }

    if (!name || !phone || !message) {
      throw new ValidationError('All fields are required');
    }

    const submission = await prisma.contactSubmission.create({
      data: { name, email, phone, message },
    });

    // TODO: Send email notification to admin
    // await emailService.sendAdminNotification(submission);

    return submission;
  }

  async getSubmissions(page: number = 1, limit: number = 10, read?: boolean) {
    const { skip, take } = getPaginationParams(page, limit);

    const where: any = {};
    if (read !== undefined) {
      where.read = read;
    }

    const [submissions, total] = await Promise.all([
      prisma.contactSubmission.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.contactSubmission.count({ where }),
    ]);

    return {
      data: submissions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getSubmissionById(id: string) {
    const submission = await prisma.contactSubmission.findUnique({ where: { id } });

    if (!submission) {
      throw new NotFoundError('Submission not found');
    }

    // Mark as read
    if (!submission.read) {
      await prisma.contactSubmission.update({
        where: { id },
        data: { read: true },
      });
    }

    return submission;
  }

  async deleteSubmission(id: string) {
    const submission = await prisma.contactSubmission.findUnique({ where: { id } });

    if (!submission) {
      throw new NotFoundError('Submission not found');
    }

    await prisma.contactSubmission.delete({ where: { id } });
    return { message: 'Submission deleted successfully' };
  }
}

export const contactService = new ContactService();
