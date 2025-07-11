import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from '@prisma/client';

/**
 * CategoriesController
 *
 * Handles HTTP requests related to categories:
 * - Creating a new category
 * - Retrieving all categories
 * - Retrieving a single category by ID
 * - Updating a category
 * - Deleting a category
 */
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * Creates a new category.
   *
   * @param data - Object containing the category name
   * @returns The created category
   */
  @Post()
  create(@Body() data: { name: string }): Promise<Category> {
    return this.categoriesService.create({ name: data.name });
  }

  /**
   * Retrieves all categories.
   *
   * @returns A list of all categories
   */
  @Get()
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  /**
   * Retrieves a category by its ID.
   *
   * @param id - The category ID
   * @returns The category or null if not found
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Category | null> {
    return this.categoriesService.findOne(id);
  }

  /**
   * Updates a category's name.
   *
   * @param id - The category ID
   * @param data - Object containing the new name (optional)
   * @returns The updated category
   */
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: { name?: string }): Promise<Category> {
    return this.categoriesService.update(id, { name: data.name });
  }

  /**
   * Deletes a category by its ID.
   *
   * @param id - The category ID
   * @returns The deleted category
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoriesService.remove(id);
  }
}
