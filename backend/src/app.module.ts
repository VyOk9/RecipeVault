import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { RecipesModule } from './recipes/recipes.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { FavoritesModule } from './favorites/favorites.module';
import { CategoriesModule } from './categories/categories.module';

/**
 * AppModule
 *
 * Root module of the application.
 * Registers global modules such as Prisma, Redis, authentication,
 * expense management, category management, and summaries.
 */
@Module({
  imports: [
    PrismaModule,
    AuthModule,
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379',
    }),
    RecipesModule,
    IngredientsModule,
    FavoritesModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
