import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { Recipe } from '@prisma/client';

/**
 * RecipesController
 *
 * Handles HTTP requests related to recipes:
 * - Creating a recipe
 * - Retrieving all recipes or one by ID
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
   * Retrieves all recipes.
   *
   * @returns A list of all recipes
   */
  @Get()
  findAll(): Promise<Recipe[]> {
    return this.recipesService.findAll();
  }

  /**
   * Retrieves a recipe by its ID.
   *
   * @param id - The ID of the recipe
   * @returns The recipe with its details
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Recipe> {
    return this.recipesService.findOne(id);
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
