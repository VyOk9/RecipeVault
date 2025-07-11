"use client"

import { useState, useEffect, useCallback } from "react"
import { RecipesService } from "@/services/recipes.service"
import type { Recipe } from "@/types"
import { useAuth } from "@/contexts/AuthContext"

export function useRecipes() {
  const { user, isAuthenticated } = useAuth()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  const loadRecipes = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setLoading(false)
      setRecipes([])
      return
    }

    try {
      setLoading(true)
      setError("")
      const data = await RecipesService.getAll(user.id)
      setRecipes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des recettes")
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, user?.id])

  const addRecipe = async (recipeData: {
    title: string
    steps: string[]
    cookTime: number
    photoUrl?: string
    userId: number
    ingredientIds: number[]
    categoryIds: number[]
  }) => {
    try {
      const newRecipe = await RecipesService.create(recipeData)
      setRecipes((prev) => [newRecipe, ...prev])
      return newRecipe
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Erreur lors de l'ajout de la recette")
    }
  }

  const updateRecipe = async (
    id: number,
    recipeData: {
      title?: string
      steps?: string[]
      cookTime?: number
      photoUrl?: string
      ingredientIds?: number[]
      categoryIds?: number[]
    },
  ) => {
    try {
      const updatedRecipe = await RecipesService.update(id, recipeData)
      setRecipes((prev) => prev.map((recipe) => (recipe.id === id ? updatedRecipe : recipe)))
      return updatedRecipe
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Erreur lors de la modification de la recette")
    }
  }

  const deleteRecipe = async (id: number) => {
    try {
      await RecipesService.delete(id)
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Erreur lors de la suppression de la recette")
    }
  }

  useEffect(() => {
    loadRecipes()
  }, [loadRecipes])

  return {
    recipes,
    loading,
    error,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    refetch: loadRecipes,
  }
}
