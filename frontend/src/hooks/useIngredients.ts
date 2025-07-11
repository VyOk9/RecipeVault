"use client"

import { useState, useEffect, useCallback } from "react"
import { IngredientsService } from "@/services/ingredients.service"
import type { Ingredient } from "@/types"
import { useAuth } from "@/contexts/AuthContext"

export function useIngredients() {
  const { user, isAuthenticated } = useAuth()
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  const loadIngredients = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setLoading(false)
      setIngredients([])
      return
    }

    try {
      setLoading(true)
      setError("")
      const data = await IngredientsService.getAll()
      setIngredients(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des ingrédients")
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, user?.id])

  const addIngredient = async (name: string) => {
    try {
      const newIngredient = await IngredientsService.create(name)
      setIngredients((prev) => [...prev, newIngredient])
      return newIngredient
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Erreur lors de l'ajout de l'ingrédient")
    }
  }

  useEffect(() => {
    loadIngredients()
  }, [loadIngredients])

  return {
    ingredients,
    loading,
    error,
    addIngredient,
    refetch: loadIngredients,
  }
}
