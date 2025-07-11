"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Recipe } from "@/types"
import Image from "next/image"

interface RecipeListProps {
  recipes: Recipe[]
  onDelete: (id: number) => void
  onViewDetails: (id: number) => void
  onAddToFavorites?: (recipeId: number) => void
  onRemoveFromFavorites?: (recipeId: number) => void
  isFavorite?: (recipeId: number) => boolean
  onClearFilters?: () => void
  isFiltered?: boolean
}

export function RecipeList({
  recipes,
  onDelete,
  onViewDetails,
  onAddToFavorites,
  onRemoveFromFavorites,
  isFavorite,
  onClearFilters,
  isFiltered = false,
}: RecipeListProps) {
  const sortedRecipes = recipes.sort((a, b) => a.title.localeCompare(b.title))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isFiltered ? "Recettes filtrées" : "Toutes les recettes"}</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedRecipes.map((recipe) => (
              <RecipeItem
                key={recipe.id}
                recipe={recipe}
                onDelete={onDelete}
                onViewDetails={onViewDetails}
                onAddToFavorites={onAddToFavorites}
                onRemoveFromFavorites={onRemoveFromFavorites}
                isFavorite={isFavorite}
              />
            ))}
          </div>
        ) : (
          <EmptyRecipeList isFiltered={isFiltered} onClearFilters={onClearFilters} />
        )}
      </CardContent>
    </Card>
  )
}

interface RecipeItemProps {
  recipe: Recipe
  onDelete: (id: number) => void
  onViewDetails: (id: number) => void
  onAddToFavorites?: (recipeId: number) => void
  onRemoveFromFavorites?: (recipeId: number) => void
  isFavorite?: (recipeId: number) => boolean
}

function RecipeItem({
  recipe,
  onDelete,
  onViewDetails,
  onAddToFavorites,
  onRemoveFromFavorites,
  isFavorite,
}: RecipeItemProps) {
  const isFav = isFavorite ? isFavorite(recipe.id) : false

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
          {onAddToFavorites && onRemoveFromFavorites && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => (isFav ? onRemoveFromFavorites(recipe.id) : onAddToFavorites(recipe.id))}
              title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              {isFav ? "❤️" : "🤍"}
            </Button>
          )}
          <Button onClick={() => onViewDetails(recipe.id)} size="sm">
            Voir
          </Button>
          <Button onClick={() => onDelete(recipe.id)} variant="destructive" size="sm">
            Supprimer
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyRecipeList({
  isFiltered,
  onClearFilters,
}: {
  isFiltered: boolean
  onClearFilters?: () => void
}) {
  return (
    <div className="text-center py-8">
      <p className="text-gray-500 mb-4">
        {isFiltered ? "Aucune recette ne correspond aux filtres" : "Aucune recette trouvée"}
      </p>
      {isFiltered && onClearFilters ? (
        <Button onClick={onClearFilters} variant="outline">
          Effacer les filtres
        </Button>
      ) : (
        <Button onClick={() => (window.location.href = "/recipes/new")}>Ajouter votre première recette</Button>
      )}
    </div>
  )
}
