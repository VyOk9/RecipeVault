import { Module } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { IngredientsController } from './ingredients.controller';

/**
 * IngredientsModule
 *
 * NestJS module responsible for managing ingredient-related logic.
 * It groups together the IngredientsService and IngredientsController.
 */
@Module({
  providers: [IngredientsService],
  controllers: [IngredientsController],
})
export class IngredientsModule {}
