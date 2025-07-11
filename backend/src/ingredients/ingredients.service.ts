import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Ingredient, Prisma } from '@prisma/client';

/**
 * IngredientsService
 *
 * Provides operations related to ingredients:
 * - Creating a new ingredient
 * - Retrieving all ingredients
 */
@Injectable()
export class IngredientsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new ingredient.
   *
   * @param data - Ingredient creation data
   * @returns The created ingredient
   */
  async create(data: Prisma.IngredientCreateInput): Promise<Ingredient> {
    return this.prisma.ingredient.create({ data });
  }

  /**
   * Retrieves all ingredients.
   *
   * @returns A list of all ingredients
   */
  async findAll(): Promise<Ingredient[]> {
    return this.prisma.ingredient.findMany();
  }
}
