import { Controller, Get, Post, Body } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { Ingredient } from '@prisma/client';

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post()
  create(@Body() data: { name: string }): Promise<Ingredient> {
    return this.ingredientsService.create({ name: data.name });
  }

  @Get()
  findAll(): Promise<Ingredient[]> {
    return this.ingredientsService.findAll();
  }
}
