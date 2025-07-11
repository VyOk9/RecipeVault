"use client"

import { useState, useEffect, useCallback } from "react"
import { FavoritesService } from "@/services/favorites.service"
import { RecipesService } from "@/services/recipes.service"
import { useAuth } from "@/contexts/AuthContext"
import type { Favorite, Recipe } from "@/types"

export function useFavorites() {
  const { user, isAuthenticated } = useAuth()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setLoading(false)
      setFavorites([])
      return
    }

    try {
      setLoading(true)
      setError("")
      const rawFavorites = await FavoritesService.getUserFavorites(user.id)
      const hydratedFavorites: Favorite[] = await Promise.all(
        rawFavorites.map(async (fav) => {
          try {
            const fullRecipe = fav.recipe?.id ? fav.recipe : await RecipesService.getById(fav.recipeId)
            return { ...fav, recipe: fullRecipe }
          } catch (recipeErr) {
            console.error(`Failed to load recipe ${fav.recipeId} for favorite ${fav.id}:`, recipeErr)
            return {
              ...fav,
              recipe: {
                id: fav.recipeId,
                title: "Recette introuvable",
                steps: [],
                cookTime: 0,
                ingredients: [],
                categories: [],
                userId: fav.userId,
              } as Recipe,
            }
          }
        }),
      )
      setFavorites(hydratedFavorites)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des favoris")
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, user?.id])

  const addFavorite = async (recipeId: number) => {
    if (!user?.id) throw new Error("User not authenticated")
    try {
      const newFavorite = await FavoritesService.addFavorite(user.id, recipeId)
      const fullRecipe = await RecipesService.getById(recipeId)
      setFavorites((prev) => [...prev, { ...newFavorite, recipe: fullRecipe }])
      return newFavorite
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Erreur lors de l'ajout aux favoris")
    }
  }

  const removeFavorite = async (favoriteId: number) => {
    try {
      await FavoritesService.removeFavorite(favoriteId)
      setFavorites((prev) => prev.filter((fav) => fav.id !== favoriteId))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Erreur lors de la suppression des favoris")
    }
  }

  const isRecipeFavorite = useCallback(
    (recipeId: number) => {
      return favorites.some((fav) => fav.recipeId === recipeId)
    },
    [favorites],
  )

  const getFavoriteIdForRecipe = useCallback(
    (recipeId: number) => {
      return favorites.find((fav) => fav.recipeId === recipeId)?.id
    },
    [favorites],
  )

  useEffect(() => {
    loadFavorites()
  }, [loadFavorites])

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    isRecipeFavorite,
    getFavoriteIdForRecipe,
    refetch: loadFavorites,
  }
}
