import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Favorite, Prisma } from '@prisma/client';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.FavoriteCreateInput): Promise<Favorite> {
    return this.prisma.favorite.create({ data });
  }

  async findAllByUser(userId: number): Promise<Favorite[]> {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: { recipe: true },
    });
  }

  async remove(id: number): Promise<Favorite> {
    return this.prisma.favorite.delete({ where: { id } });
  }
}
