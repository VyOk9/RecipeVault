import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';

/**
 * FavoritesModule
 *
 * NestJS module responsible for managing user favorites.
 * It bundles the FavoritesService and FavoritesController.
 */
@Module({
  providers: [FavoritesService],
  controllers: [FavoritesController],
})
export class FavoritesModule {}
