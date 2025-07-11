import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Favorite, Prisma } from '@prisma/client';

/**
 * FavoritesService
 *
 * Provides operations related to user favorites:
 * - Creating a favorite
 * - Retrieving all favorites for a user (including associated recipes)
 * - Removing a favorite by ID
 */
@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new favorite entry.
   *
   * @param data - Favorite creation data
   * @returns The created favorite
   */
  async create(data: Prisma.FavoriteCreateInput): Promise<Favorite> {
    return this.prisma.favorite.create({ data });
  }

  /**
   * Retrieves all favorites for a given user, including the related recipes.
   *
   * @param userId - The user's ID
   * @returns A list of favorites with their associated recipes
   */
  async findAllByUser(userId: number): Promise<Favorite[]> {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: { recipe: true },
    });
  }

  /**
   * Removes a favorite by its ID.
   *
   * @param id - The favorite ID
   * @returns The deleted favorite
   */
  async remove(id: number): Promise<Favorite> {
    return this.prisma.favorite.delete({ where: { id } });
  }
}
