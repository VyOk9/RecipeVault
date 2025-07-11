import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';

/**
 * RecipesModule
 *
 * NestJS module responsible for handling recipe-related logic.
 * It bundles the RecipesService and RecipesController.
 */
@Module({
  providers: [RecipesService],
  controllers: [RecipesController],
})
export class RecipesModule {}
