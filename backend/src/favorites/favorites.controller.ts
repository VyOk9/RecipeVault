import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { Favorite } from '@prisma/client';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  create(@Body() data: { userId: number; recipeId: number }): Promise<Favorite> {
    return this.favoritesService.create({
      user: { connect: { id: data.userId } },
      recipe: { connect: { id: data.recipeId } },
    });
  }


  @Get('user/:userId')
  findAllByUser(@Param('userId', ParseIntPipe) userId: number): Promise<Favorite[]> {
    return this.favoritesService.findAllByUser(userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Favorite> {
    return this.favoritesService.remove(id);
  }
}
