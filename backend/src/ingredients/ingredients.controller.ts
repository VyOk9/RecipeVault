import { Controller, Get, Post, Body } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { Ingredient } from '@prisma/client';

/**
 * IngredientsController
 *
 * Handles HTTP requests related to ingredients:
 * - Creating a new ingredient
 * - Retrieving all ingredients
 */
@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  /**
   * Creates a new ingredient.
   *
   * @param data - Ingredient data containing the name
   * @returns The created ingredient
   */
  @Post()
  create(@Body() data: { name: string }): Promise<Ingredient> {
    return this.ingredientsService.create({ name: data.name });
  }

  /**
   * Retrieves all ingredients.
   *
   * @returns A list of all ingredients
   */
  @Get()
  findAll(): Promise<Ingredient[]> {
    return this.ingredientsService.findAll();
  }
}
