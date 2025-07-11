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

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

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

  @Get()
  findAll(): Promise<Recipe[]> {
    return this.recipesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Recipe> {
    return this.recipesService.findOne(id);
  }

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

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Recipe> {
    return this.recipesService.remove(id);
  }
}
