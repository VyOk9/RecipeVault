"use client"

import { useState, useEffect, useCallback } from "react"
import { IngredientsService } from "@/services/ingredients.service"
import type { Ingredient } from "@/types"

export function useIngredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  const loadIngredients = useCallback(async () => {
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
  }, [])

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
