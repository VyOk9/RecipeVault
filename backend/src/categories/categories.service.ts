import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Category, Prisma } from '@prisma/client';

/**
 * CategoriesService
 *
 * Provides operations related to categories:
 * - Creating a new category
 * - Retrieving all categories
 * - Retrieving a single category by ID
 * - Updating a category
 * - Deleting a category
 */
@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new category.
   *
   * @param data - Category creation data
   * @returns The created category
   */
  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return this.prisma.category.create({ data });
  }

  /**
   * Retrieves all categories.
   *
   * @returns A list of all categories
   */
  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  /**
   * Retrieves a category by its ID.
   *
   * @param id - The category ID
   * @returns The category or null if not found
   */
  async findOne(id: number): Promise<Category | null> {
    return this.prisma.category.findUnique({ where: { id } });
  }

  /**
   * Updates an existing category.
   *
   * @param id - The category ID
   * @param data - Category update data
   * @returns The updated category
   */
  async update(id: number, data: Prisma.CategoryUpdateInput): Promise<Category> {
    return this.prisma.category.update({ where: { id }, data });
  }

  /**
   * Deletes a category by its ID.
   *
   * @param id - The category ID
   * @returns The deleted category
   */
  async remove(id: number): Promise<Category> {
    return this.prisma.category.delete({ where: { id } });
  }
}
