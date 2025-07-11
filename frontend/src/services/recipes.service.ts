import { apiClient } from "@/lib/api"
import { API_ENDPOINTS } from "@/constants"
import type { Recipe } from "@/types"

export class RecipesService {
  static async getAll(): Promise<Recipe[]> {
    return apiClient.get<Recipe[]>(API_ENDPOINTS.RECIPES)
  }

  static async getById(id: number): Promise<Recipe> {
    return apiClient.get<Recipe>(`${API_ENDPOINTS.RECIPES}/${id}`)
  }

  static async create(recipeData: {
    title: string
    steps: string[]
    cookTime: number
    photoUrl?: string
    userId: number
    ingredientIds: number[]
    categoryIds: number[]
  }): Promise<Recipe> {
    return apiClient.post<Recipe>(API_ENDPOINTS.RECIPES, recipeData)
  }

  static async update(
    id: number,
    recipeData: {
      title?: string
      steps?: string[]
      cookTime?: number
      photoUrl?: string
      ingredientIds?: number[]
      categoryIds?: number[]
    },
  ): Promise<Recipe> {
    return apiClient.put<Recipe>(`${API_ENDPOINTS.RECIPES}/${id}`, recipeData)
  }

  static async delete(id: number): Promise<{ deleted: boolean }> {
    return apiClient.delete<{ deleted: boolean }>(`${API_ENDPOINTS.RECIPES}/${id}`)
  }
}
