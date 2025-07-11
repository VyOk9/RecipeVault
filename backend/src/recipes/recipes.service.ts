import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Recipe } from '@prisma/client';

/**
 * RecipesService
 *
 * Provides operations related to recipes:
 * - Creating (with ingredient and category associations)
 * - Retrieving (all or by ID) for a specific user
 * - Updating
 * - Deleting (along with associated favorites)
 */
@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new recipe with associated ingredients and categories.
   *
   * @param data - Recipe data (title, steps, cook time, optional photo URL, user, ingredients, and categories)
   * @returns The created recipe with ingredients, categories, and favorites included
   */
  async create(data: {
    title: string;
    steps: string[];
    cookTime: number;
    photoUrl?: string;
    userId: number;
    ingredientIds: number[];
    categoryIds: number[];
  }): Promise<Recipe> {
    return this.prisma.recipe.create({
      data: {
        title: data.title,
        steps: data.steps,
        cookTime: data.cookTime,
        photoUrl: data.photoUrl,
        userId: data.userId,
        ingredients: {
          connect: data.ingredientIds.map(id => ({ id })),
        },
        categories: {
          connect: data.categoryIds.map(id => ({ id })),
        },
      },
      include: {
        ingredients: true,
        categories: true,
        favorites: true,
      },
    });
  }

  /**
   * Retrieves all recipes for a specific user.
   *
   * @param userId - The user's ID
   * @returns A list of recipes belonging to the user
   */
  async findAll(userId: number): Promise<Recipe[]> {
    return this.prisma.recipe.findMany({
      where: { userId },
      include: {
        ingredients: true,
        categories: true,
        favorites: true,
      },
    });
  }

  /**
   * Retrieves a single recipe by its ID and verifies ownership.
   *
   * @param id - The recipe ID
   * @param userId - The user's ID
   * @returns The found recipe if it belongs to the user
   * @throws NotFoundException if the recipe doesn't exist or doesn't belong to the user
   */
  async findOne(id: number, userId: number): Promise<Recipe> {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: {
        ingredients: true,
        categories: true,
        favorites: true,
      },
    });

    if (!recipe || recipe.userId !== userId) {
      throw new NotFoundException(`Recipe with id ${id} not found for this user`);
    }

    return recipe;
  }

  /**
   * Updates an existing recipe.
   *
   * @param id - The recipe ID
   * @param data - Partial update data
   * @returns The updated recipe with ingredients, categories, and favorites
   */
  async update(
    id: number,
    data: {
      title?: string;
      steps?: string[];
      cookTime?: number;
      photoUrl?: string;
      ingredientIds?: number[];
      categoryIds?: number[];
    },
  ): Promise<Recipe> {
    const updateData: Prisma.RecipeUpdateInput = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.steps !== undefined) updateData.steps = data.steps;
    if (data.cookTime !== undefined) updateData.cookTime = data.cookTime;
    if (data.photoUrl !== undefined) updateData.photoUrl = data.photoUrl;

    if (data.ingredientIds !== undefined) {
      updateData.ingredients = {
        set: data.ingredientIds.map(id => ({ id })),
      };
    }

    if (data.categoryIds !== undefined) {
      updateData.categories = {
        set: data.categoryIds.map(id => ({ id })),
      };
    }

    return this.prisma.recipe.update({
      where: { id },
      data: updateData,
      include: {
        ingredients: true,
        categories: true,
        favorites: true,
      },
    });
  }

  /**
   * Deletes a recipe and all associated favorites.
   *
   * @param id - The recipe ID
   * @returns The deleted recipe
   */
  async remove(id: number): Promise<Recipe> {
    await this.prisma.favorite.deleteMany({
      where: { recipeId: id },
    });
    return this.prisma.recipe.delete({
      where: { id },
      include: {
        ingredients: true,
        categories: true,
        favorites: true,
      },
    });
  }
}
