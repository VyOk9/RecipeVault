import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { Favorite } from '@prisma/client';

/**
 * FavoritesController
 *
 * Handles HTTP requests related to user favorites:
 * - Creating a favorite
 * - Retrieving all favorites for a specific user
 * - Removing a favorite by ID
 */
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  /**
   * Creates a new favorite entry linking a user and a recipe.
   *
   * @param data - Contains userId and recipeId to connect
   * @returns The created favorite
   */
  @Post()
  create(@Body() data: { userId: number; recipeId: number }): Promise<Favorite> {
    return this.favoritesService.create({
      user: { connect: { id: data.userId } },
      recipe: { connect: { id: data.recipeId } },
    });
  }

  /**
   * Retrieves all favorites for a given user.
   *
   * @param userId - The ID of the user
   * @returns List of favorites belonging to the user
   */
  @Get('user/:userId')
  findAllByUser(@Param('userId', ParseIntPipe) userId: number): Promise<Favorite[]> {
    return this.favoritesService.findAllByUser(userId);
  }

  /**
   * Deletes a favorite by its ID.
   *
   * @param id - The favorite ID
   * @returns The deleted favorite
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Favorite> {
    return this.favoritesService.remove(id);
  }
}
