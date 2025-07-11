"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { RecipeForm } from "@/components/recipes/RecipeForm"
import { useRecipes } from "@/hooks/useRecipes"
import { useAuth } from "@/contexts/AuthContext"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { ROUTES } from "@/constants"
import { useEffect } from "react"

export default function NewRecipePage() {
  const { addRecipe } = useRecipes()
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login")
    }
  }, [loading, isAuthenticated, router])

  const handleSubmit = async (data: {
    title: string
    steps: string
    cookTime: string
    photoUrl?: string
    ingredientIds: number[]
    categoryIds: number[]
  }) => {
    if (!user?.id) {
      console.error("User not authenticated for adding recipe.")
      return
    }
    try {
      await addRecipe({ ...data, userId: user.id })
      router.push(ROUTES.RECIPES)
    } catch (error) {
      console.error("Erreur lors de l'ajout de la recette:", error)
      throw error
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner text="Chargement..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">RecipeVault</h1>
          <Link href={ROUTES.RECIPES} className="text-blue-600 hover:underline">
            ← Retour aux recettes
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <RecipeForm onSubmit={handleSubmit} />
        </div>
      </main>
    </div>
  )
}
