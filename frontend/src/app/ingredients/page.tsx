"use client"
import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { AlertMessage } from "@/components/common/AlertMessage"
import { IngredientForm } from "@/components/ingredients/IngredientForm"
import { IngredientList } from "@/components/ingredients/IngredientList"
import { Button } from "@/components/ui/button"
import { useIngredients } from "@/hooks/useIngredients"

export default function IngredientsPage() {
  const { ingredients, loading, addIngredient } = useIngredients()
  const [showForm, setShowForm] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("")
        setSuccessMessage("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [errorMessage, successMessage])

  const handleAddIngredient = async (name: string) => {
    try {
      setErrorMessage("")
      setSuccessMessage("")
      await addIngredient(name)
      setShowForm(false)
      setSuccessMessage("Ingrédient ajouté avec succès !")
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Erreur lors de l'ajout")
    }
  }

  if (loading) {
    return (
      <DashboardLayout currentPage="ingredients">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner text="Chargement des ingrédients..." />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout currentPage="ingredients">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Mes Ingrédients</h2>
          <p className="text-gray-600 mt-1">Gérez les ingrédients disponibles pour vos recettes</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>➕ Nouvel ingrédient</Button>
      </div>

      {errorMessage && (
        <div className="mb-6">
          <AlertMessage type="error" message={errorMessage} />
        </div>
      )}

      {successMessage && (
        <div className="mb-6">
          <AlertMessage type="success" message={successMessage} />
        </div>
      )}

      {showForm && <IngredientForm onSubmit={handleAddIngredient} onCancel={() => setShowForm(false)} />}

      <IngredientList ingredients={ingredients} onShowForm={() => setShowForm(true)} />
    </DashboardLayout>
  )
}
