"use client"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { FavoriteList } from "@/components/favorites/FavoriteList"
import { useFavorites } from "@/hooks/useFavorites"
import { useRouter } from "next/navigation"
import { AlertMessage } from "@/components/common/AlertMessage"
import { useState, useEffect } from "react"
import type { Recipe } from "@/types"

export default function FavoritesPage() {
  const { favorites, loading, removeFavorite, error } = useFavorites()
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")

  useEffect(() => {
    if (error) {
      setMessage(error)
      setMessageType("error")
    } else {
      setMessage("")
    }
  }, [error])

  const handleRemoveFavorite = async (recipeId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir retirer cette recette de vos favoris ?")) return

    try {
      const favoriteEntry = favorites.find((fav) => fav.recipeId === recipeId)

      if (favoriteEntry) {
        await removeFavorite(favoriteEntry.id)
        setMessage("Recette retirée des favoris avec succès !")
        setMessageType("success")
      } else {
        setMessage("Favori non trouvé pour cette recette.")
        setMessageType("error")
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur lors du retrait des favoris")
      setMessageType("error")
      console.error("Error removing favorite:", error)
    }
  }

  const handleViewDetails = (id: number) => {
    router.push(`/recipes/${id}`)
  }

  const favoriteRecipes: Recipe[] = favorites.map((fav) => fav.recipe)

  if (loading) {
    return (
      <DashboardLayout currentPage="favorites">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner text="Chargement des favoris..." />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout currentPage="favorites">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Mes Recettes Favorites</h2>
          <p className="text-gray-600 mt-1">Retrouvez toutes vos recettes préférées ici</p>
        </div>
      </div>

      {message && (
        <div className="mb-6">
          <AlertMessage type={messageType} message={message} onClose={() => setMessage("")} />
        </div>
      )}

      <FavoriteList
        favorites={favoriteRecipes}
        onRemoveFromFavorites={handleRemoveFavorite}
        onViewDetails={handleViewDetails}
      />
    </DashboardLayout>
  )
}
