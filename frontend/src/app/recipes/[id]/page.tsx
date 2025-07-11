"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { AlertMessage } from "@/components/common/AlertMessage"
import { RecipeForm } from "@/components/recipes/RecipeForm"
import { RecipesService } from "@/services/recipes.service"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import type { Recipe } from "@/types"
import { ROUTES } from "@/constants"

export default function RecipeDetailPage() {
  const router = useRouter()
  const params = useParams()
  const recipeId = Number(params.id)

  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")

  useEffect(() => {
    if (Number.isNaN(recipeId)) {
      setError("ID de recette invalide.")
      setLoading(false)
      return
    }

    const fetchRecipe = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await RecipesService.getById(recipeId)
        setRecipe(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement de la recette.")
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [recipeId])

  const handleUpdateRecipe = async (data: {
    title?: string
    steps?: string[]
    cookTime?: number
    photoUrl?: string
    ingredientIds?: number[]
    categoryIds?: number[]
  }) => {
    try {
      setMessage("")
      const updatedRecipe = await RecipesService.update(recipeId, data)
      setRecipe(updatedRecipe)
      setIsEditing(false)
      setMessage("Recette mise à jour avec succès !")
      setMessageType("success")
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Erreur lors de la mise à jour de la recette.")
      setMessageType("error")
      console.error("Error updating recipe:", err)
    }
  }

  if (loading) {
    return (
      <DashboardLayout currentPage="recipes">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner text="Chargement de la recette..." />
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout currentPage="recipes">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <AlertMessage type="error" message={error} />
          <Button onClick={() => router.push(ROUTES.RECIPES)} className="mt-4">
            Retour aux recettes
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  if (!recipe) {
    return (
      <DashboardLayout currentPage="recipes">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-gray-600">Recette introuvable.</p>
          <Button onClick={() => router.push(ROUTES.RECIPES)} className="mt-4">
            Retour aux recettes
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout currentPage="recipes">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{isEditing ? "Modifier la Recette" : recipe.title}</h2>
          <p className="text-gray-600 mt-1">
            {isEditing ? "Mettez à jour les détails de votre recette" : "Détails de la recette"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsEditing(!isEditing)} variant="outline">
            {isEditing ? "Annuler la modification" : "Modifier la recette"}
          </Button>
          <Link href={ROUTES.RECIPES}>
            <Button variant="secondary">← Retour aux recettes</Button>
          </Link>
        </div>
      </div>

      {message && (
        <div className="mb-6">
          <AlertMessage type={messageType} message={message} onClose={() => setMessage("")} />
        </div>
      )}

      {isEditing ? (
        <div className="max-w-2xl mx-auto">
          <RecipeForm
            onSubmit={handleUpdateRecipe}
            initialData={{
              title: recipe.title,
              steps: recipe.steps,
              cookTime: recipe.cookTime,
              photoUrl: recipe.photoUrl,
              ingredients: recipe.ingredients,
              categories: recipe.categories,
            }}
          />
        </div>
      ) : (
        <Card className="max-w-3xl mx-auto">
          {recipe.photoUrl && (
            <div className="relative h-64 w-full">
              <Image
                src={recipe.photoUrl || "/placeholder.svg?height=256&width=600"}
                alt={recipe.title}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
              />
            </div>
          )}
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{recipe.title}</h3>
              <p className="text-gray-600">Temps de cuisson: {recipe.cookTime} minutes</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Catégories</h4>
              <div className="flex flex-wrap gap-2">
                {recipe.categories?.map((category) => (
                  <Badge key={category.id} variant="secondary">
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Ingrédients</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {recipe.ingredients?.map((ingredient) => (
                  <li key={ingredient.id}>{ingredient.name}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Étapes de préparation</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                {recipe.steps?.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}
