"use client"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { RecipeList } from "@/components/recipes/RecipeList"
import { Button } from "@/components/ui/button"
import { useRecipes } from "@/hooks/useRecipes"
import { useFavorites } from "@/hooks/useFavorites"
import { useRouter } from "next/navigation"
import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCategories } from "@/hooks/useCategories"
import { useIngredients } from "@/hooks/useIngredients"

export default function RecipesPage() {
  const { recipes, loading, deleteRecipe } = useRecipes()
  const {
    favorites,
    addFavorite,
    removeFavorite,
    isRecipeFavorite,
    getFavoriteIdForRecipe,
    refetch: refetchFavorites,
  } = useFavorites()
  const { categories, loading: categoriesLoading } = useCategories()
  const { ingredients, loading: ingredientsLoading } = useIngredients()
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedIngredient, setSelectedIngredient] = useState("")

  const handleAddOrRemoveFavorite = async (recipeId: number) => {
    try {
      if (isRecipeFavorite(recipeId)) {
        const favoriteId = getFavoriteIdForRecipe(recipeId)
        if (favoriteId) {
          await removeFavorite(favoriteId)
        }
      } else {
        await addFavorite(recipeId)
      }
      refetchFavorites()
    } catch (error) {
      console.error("Erreur lors de la gestion des favoris:", error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette recette ?")) return

    try {
      await deleteRecipe(id)
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
    }
  }

  const handleViewDetails = (id: number) => {
    router.push(`/recipes/${id}`)
  }

  const filteredRecipes = useMemo(() => {
    let filtered = recipes

    if (searchTerm) {
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.steps
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter((recipe) => recipe.categories.some((cat) => cat.name === selectedCategory))
    }

    if (selectedIngredient) {
      filtered = filtered.filter((recipe) => recipe.ingredients.some((ing) => ing.name === selectedIngredient))
    }

    return filtered
  }, [recipes, searchTerm, selectedCategory, selectedIngredient])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setSelectedIngredient("")
  }

  const isFiltered = searchTerm || selectedCategory || selectedIngredient

  if (loading || categoriesLoading || ingredientsLoading) {
    return (
      <DashboardLayout currentPage="recipes">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner text="Chargement des recettes..." />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout currentPage="recipes">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Mes Recettes</h2>
          <p className="text-gray-600 mt-1">{filteredRecipes.length} recette(s) trouvée(s)</p>
        </div>
        <Button onClick={() => router.push("/recipes/new")}>➕ Nouvelle recette</Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtres de recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Recherche</Label>
              <Input
                id="search"
                type="text"
                placeholder="Titre ou étapes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="category">Catégorie</Label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="ingredient">Ingrédient</Label>
              <select
                id="ingredient"
                value={selectedIngredient}
                onChange={(e) => setSelectedIngredient(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous les ingrédients</option>
                {ingredients.map((ingredient) => (
                  <option key={ingredient.id} value={ingredient.name}>
                    {ingredient.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button onClick={clearFilters} variant="outline" className="w-full bg-transparent">
                Effacer les filtres
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <RecipeList
        recipes={filteredRecipes}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
        onAddToFavorites={handleAddOrRemoveFavorite}
        onRemoveFromFavorites={handleAddOrRemoveFavorite}
        isFavorite={isRecipeFavorite}
        onClearFilters={clearFilters}
        isFiltered={isFiltered}
      />
    </DashboardLayout>
  )
}
