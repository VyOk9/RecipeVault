import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';

/**
 * CategoriesModule
 *
 * NestJS module responsible for managing category-related logic.
 * It bundles together the CategoriesService and CategoriesController.
 */
@Module({
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
