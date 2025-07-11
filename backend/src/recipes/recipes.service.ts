import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Recipe } from '@prisma/client';

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

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

  async findAll(): Promise<Recipe[]> {
    return this.prisma.recipe.findMany({
      include: {
        ingredients: true,
        categories: true,
        favorites: true,
      },
    });
  }

  async findOne(id: number): Promise<Recipe> {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: {
        ingredients: true,
        categories: true,
        favorites: true,
      },
    });
    if (!recipe) throw new NotFoundException(`Recipe with id ${id} not found`);
    return recipe;
  }

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
