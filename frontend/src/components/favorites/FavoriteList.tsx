"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Recipe } from "@/types"
import Image from "next/image"

interface FavoriteListProps {
  favorites: Recipe[]
  onRemoveFromFavorites: (recipeId: number) => void
  onViewDetails: (id: number) => void
}

export function FavoriteList({ favorites, onRemoveFromFavorites, onViewDetails }: FavoriteListProps) {
  const sortedFavorites = favorites.sort((a, b) => a.title.localeCompare(b.title))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes Recettes Favorites</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedFavorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedFavorites.map((recipe) => (
              <FavoriteItem
                key={recipe.id}
                recipe={recipe}
                onRemoveFromFavorites={onRemoveFromFavorites}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Vous n'avez pas encore de recettes favorites.</p>
            <Button onClick={() => (window.location.href = "/recipes")}>Découvrir des recettes</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface FavoriteItemProps {
  recipe: Recipe
  onRemoveFromFavorites: (recipeId: number) => void
  onViewDetails: (id: number) => void
}

function FavoriteItem({ recipe, onRemoveFromFavorites, onViewDetails }: FavoriteItemProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={recipe.photoUrl || "/placeholder.svg?height=192&width=384"}
          alt={recipe.title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>
      <CardContent className="p-4 space-y-3">
        <h3 className="font-bold text-lg text-gray-900">{recipe.title}</h3>
        <div className="flex flex-wrap gap-2">
          {recipe.categories?.map((category) => (
            <Badge key={category.id} variant="secondary">
              {category.name}
            </Badge>
          ))}
        </div>
        <p className="text-sm text-gray-600">Temps de cuisson: {recipe.cookTime} minutes</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={() => onRemoveFromFavorites(recipe.id)}
            variant="destructive"
            size="sm"
            title="Retirer des favoris"
          >
            💔
          </Button>
          <Button onClick={() => onViewDetails(recipe.id)} size="sm">
            Voir
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
