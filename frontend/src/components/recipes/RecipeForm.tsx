"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertMessage } from "@/components/common/AlertMessage"
import { useCategories } from "@/hooks/useCategories"
import { useIngredients } from "@/hooks/useIngredients"
import { TagInput } from "@/components/common/TagInput"
import type { Category, Ingredient } from "@/types"

interface RecipeFormProps {
  onSubmit: (data: {
    title: string
    steps: string[]
    cookTime: number
    photoUrl?: string
    ingredientIds: number[]
    categoryIds: number[]
  }) => Promise<void>
  initialData?: {
    title: string
    steps: string[]
    cookTime: number
    photoUrl?: string
    ingredients: Ingredient[]
    categories: Category[]
  }
  loading?: boolean
}

export function RecipeForm({ onSubmit, initialData, loading = false }: RecipeFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [steps, setSteps] = useState(initialData?.steps.join("\n") || "")
  const [cookTime, setCookTime] = useState(initialData?.cookTime.toString() || "")
  const [photoUrl, setPhotoUrl] = useState(initialData?.photoUrl || "")
  const [selectedIngredientNames, setSelectedIngredientNames] = useState(
    initialData?.ingredients.map((ing) => ing.name) || [],
  )
  const [selectedCategoryNames, setSelectedCategoryNames] = useState(
    initialData?.categories.map((cat) => cat.name) || [],
  )
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")

  const { categories, loading: categoriesLoading, addCategory, refetch: refetchCategories } = useCategories()
  const { ingredients, loading: ingredientsLoading, addIngredient, refetch: refetchIngredients } = useIngredients()

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setSteps(initialData.steps.join("\n"))
      setCookTime(initialData.cookTime.toString())
      setPhotoUrl(initialData.photoUrl || "")
      setSelectedIngredientNames(initialData.ingredients.map((ing) => ing.name))
      setSelectedCategoryNames(initialData.categories.map((cat) => cat.name))
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")

    const parsedCookTime = Number.parseInt(cookTime, 10)
    if (Number.isNaN(parsedCookTime)) {
      setMessage("Le temps de cuisson doit être un nombre valide.")
      setMessageType("error")
      return
    }

    const finalIngredientIds: number[] = []
    for (const name of selectedIngredientNames) {
      const existingIngredient = ingredients.find((ing) => ing.name.toLowerCase() === name.toLowerCase())
      if (existingIngredient) {
        finalIngredientIds.push(existingIngredient.id)
      } else {
        const newIngredient = await addIngredient(name)
        finalIngredientIds.push(newIngredient.id)
      }
    }

    const finalCategoryIds: number[] = []
    for (const name of selectedCategoryNames) {
      const existingCategory = categories.find((cat) => cat.name.toLowerCase() === name.toLowerCase())
      if (existingCategory) {
        finalCategoryIds.push(existingCategory.id)
      } else {
        const newCategory = await addCategory(name)
        finalCategoryIds.push(newCategory.id)
      }
    }

    const stepsArray = steps
      .split("\n")
      .map((step) => step.trim())
      .filter(Boolean)

    try {
      await onSubmit({
        title,
        steps: stepsArray,
        cookTime: parsedCookTime,
        photoUrl: photoUrl || undefined,
        ingredientIds: finalIngredientIds,
        categoryIds: finalCategoryIds,
      })

      setMessage("Recette enregistrée avec succès !")
      setMessageType("success")
      refetchIngredients()
      refetchCategories()

      if (!initialData) {
        setTitle("")
        setSteps("")
        setCookTime("")
        setPhotoUrl("")
        setSelectedIngredientNames([])
        setSelectedCategoryNames([])
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur lors de l'enregistrement de la recette")
      setMessageType("error")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Modifier la Recette" : "Nouvelle Recette"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Ex: Poulet rôti aux herbes"
            />
          </div>

          <div>
            <Label htmlFor="cookTime">Temps de cuisson (en minutes)</Label>
            <Input
              id="cookTime"
              type="number"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              required
              placeholder="Ex: 45"
            />
          </div>

          <div>
            <Label htmlFor="photoUrl">URL de la photo (optionnel)</Label>
            <Input
              id="photoUrl"
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="Ex: https://example.com/poulet.jpg"
            />
          </div>

          <TagInput
            label="Ingrédients"
            placeholder="Ajouter un ingrédient (Entrée/Tab pour valider)"
            value={selectedIngredientNames}
            onChange={setSelectedIngredientNames}
            disabled={ingredientsLoading}
          />

          <TagInput
            label="Catégories"
            placeholder="Ajouter une catégorie (Entrée/Tab pour valider)"
            value={selectedCategoryNames}
            onChange={setSelectedCategoryNames}
            disabled={categoriesLoading}
          />

          <div>
            <Label htmlFor="steps">Étapes de préparation (une étape par ligne)</Label>
            <Textarea
              id="steps"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              required
              placeholder={`1. Préchauffer le four à 200°C.\n2. Assaisonner le poulet.\n3. Enfourner pendant 45 minutes.`}
              rows={8}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Enregistrement en cours..." : initialData ? "Modifier la recette" : "Ajouter la recette"}
          </Button>
        </form>

        {message && (
          <div className="mt-4">
            <AlertMessage type={messageType} message={message} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
