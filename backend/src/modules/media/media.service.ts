import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../../core/utils/errors.js';
import { getPaginationParams } from '../../core/utils/helpers.js';

const prisma = new PrismaClient();

export class MediaService {
  async createMedia(filename: string, url: string, mimeType: string, size: number) {
    const media = await prisma.mediaFile.create({
      data: { filename, url, mimeType, size },
    });

    return media;
  }

  async getMediaFiles(page: number = 1, limit: number = 20) {
    const { skip, take } = getPaginationParams(page, limit);

    const [files, total] = await Promise.all([
      prisma.mediaFile.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.mediaFile.count(),
    ]);

    return {
      data: files,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getMediaById(id: string) {
    const media = await prisma.mediaFile.findUnique({ where: { id } });

    if (!media) {
      throw new NotFoundError('Media file not found');
    }

    return media;
  }

  async deleteMedia(id: string) {
    const media = await prisma.mediaFile.findUnique({ where: { id } });

    if (!media) {
      throw new NotFoundError('Media file not found');
    }

    await prisma.mediaFile.delete({ where: { id } });
    return { message: 'Media file deleted successfully' };
  }
}

export const mediaService = new MediaService();
