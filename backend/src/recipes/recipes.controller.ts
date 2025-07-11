import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { Recipe } from '@prisma/client';

/**
 * RecipesController
 *
 * Handles HTTP requests related to recipes:
 * - Creating a recipe
 * - Retrieving recipes for a specific user
 * - Updating a recipe
 * - Deleting a recipe
 */
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  /**
   * Creates a new recipe.
   *
   * @param body - Recipe data (title, steps, cook time, optional photo, user, ingredients, and categories)
   * @returns The created recipe
   */
  @Post()
  create(
    @Body()
    body: {
      title: string;
      steps: string[];
      cookTime: number;
      photoUrl?: string;
      userId: number;
      ingredientIds: number[];
      categoryIds: number[];
    },
  ): Promise<Recipe> {
    return this.recipesService.create(body);
  }

  /**
   * Retrieves all recipes for a given user.
   *
   * @param userId - The user's ID (passed as query param)
   * @returns A list of recipes belonging to the user
   */
  @Get()
  findAll(
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<Recipe[]> {
    return this.recipesService.findAll(userId);
  }

  /**
   * Retrieves a specific recipe by ID for a given user.
   *
   * @param id - The ID of the recipe
   * @param userId - The user's ID (passed as query param)
   * @returns The recipe with its details if it belongs to the user
   */
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<Recipe> {
    return this.recipesService.findOne(id, userId);
  }

  /**
   * Updates a recipe by its ID.
   *
   * @param id - The ID of the recipe
   * @param body - Partial data to update the recipe
   * @returns The updated recipe
   */
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      title?: string;
      steps?: string[];
      cookTime?: number;
      photoUrl?: string;
      ingredientIds?: number[];
      categoryIds?: number[];
    },
  ): Promise<Recipe> {
    return this.recipesService.update(id, body);
  }

  /**
   * Deletes a recipe by its ID.
   *
   * @param id - The ID of the recipe
   * @returns The deleted recipe
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Recipe> {
    return this.recipesService.remove(id);
  }
}
