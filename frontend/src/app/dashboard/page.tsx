"use client"

import type React from "react"

import { useEffect, useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { useAuth } from "@/contexts/AuthContext"
import { useRecipes } from "@/hooks/useRecipes"
import type { Recipe } from "@/types"

export default function DashboardPage() {
  const { user, showWelcome } = useAuth()
  const { recipes, loading } = useRecipes()
  const router = useRouter()

  const [totalRecipes, setTotalRecipes] = useState(0)
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([])

  const currentPage = "dashboard"

  const quickActions = useMemo(
    () => [
      { href: "/recipes/new", label: "➕ Ajouter une recette", key: "add-recipe" },
      { href: "/categories", label: "📁 Gérer les catégories", key: "categories" },
      { href: "/ingredients", label: "🥕 Gérer les ingrédients", key: "ingredients" },
      { href: "/favorites", label: "❤️ Voir les favoris", key: "favorites" },
    ],
    [],
  )

  const handleMouseDown = useCallback(
    (href: string, e: React.MouseEvent) => {
      e.preventDefault()
      router.push(href)
    },
    [router],
  )

  useEffect(() => {
    if (recipes.length > 0) {
      setTotalRecipes(recipes.length)
      const sortedRecipes = recipes
        .sort((a, b) => b.id - a.id)
        .slice(0, 5)
      setRecentRecipes(sortedRecipes)
    } else {
      setTotalRecipes(0)
      setRecentRecipes([])
    }
  }, [recipes])

  if (loading) {
    return (
      <DashboardLayout currentPage={currentPage}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des données...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout currentPage={currentPage}>
      {showWelcome && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          <p className="font-medium">Bienvenue, {user?.email?.split("@")[0] || "Utilisateur"} ! 👋</p>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h2>
        <p className="text-gray-600">Gérez vos recettes et découvrez de nouvelles saveurs</p>
      </div>

      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>📚</span>
              Total des recettes
            </CardTitle>
            <CardDescription>Nombre total de recettes dans votre collection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{totalRecipes}</div>
            <p className="text-sm text-gray-500 mt-1">Recettes enregistrées</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Gérez vos recettes rapidement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map(({ href, label, key }) => (
              <div
                key={key}
                onMouseDown={(e) => handleMouseDown(href, e)}
                className="w-full text-left px-4 py-3 rounded-md transition text-gray-600 hover:text-blue-600 hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 select-none"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    router.push(href)
                  }
                }}
              >
                {label}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recettes récentes</CardTitle>
            <CardDescription>Vos dernières recettes ajoutées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentRecipes.length > 0 ? (
                recentRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{recipe.title}</p>
                      <p className="text-sm text-gray-500">Temps de cuisson: {recipe.cookTime}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">Aucune recette récente</p>
              )}
            </div>

            {recentRecipes.length > 0 && (
              <div className="mt-4">
                <div
                  onMouseDown={(e) => handleMouseDown("/recipes", e)}
                  className="block w-full text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition text-sm cursor-pointer select-none"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      router.push("/recipes")
                    }
                  }}
                >
                  Voir toutes les recettes
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
