import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Ingredient, Prisma } from '@prisma/client';

@Injectable()
export class IngredientsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.IngredientCreateInput): Promise<Ingredient> {
    return this.prisma.ingredient.create({ data });
  }

  async findAll(): Promise<Ingredient[]> {
    return this.prisma.ingredient.findMany();
  }
}
