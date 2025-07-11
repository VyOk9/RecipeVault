"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Ingredient } from "@/types"

interface IngredientListProps {
  ingredients: Ingredient[]
  onShowForm: () => void
}

export function IngredientList({ ingredients, onShowForm }: IngredientListProps) {
  if (ingredients.length === 0) {
    return (
      <div className="col-span-full">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500 mb-4">Aucun ingrédient trouvé</p>
            <Button onClick={onShowForm}>Ajouter votre premier ingrédient</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {ingredients.map((ingredient) => (
        <IngredientItem key={ingredient.id} ingredient={ingredient} />
      ))}
    </div>
  )
}

interface IngredientItemProps {
  ingredient: Ingredient
}

function IngredientItem({ ingredient }: IngredientItemProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{ingredient.name}</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
