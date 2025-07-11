import { apiClient } from "@/lib/api"
import { API_ENDPOINTS } from "@/constants"
import type { Recipe } from "@/types"

export class RecipesService {
  static async getAll(userId: number): Promise<Recipe[]> {
    return apiClient.get<Recipe[]>(`${API_ENDPOINTS.RECIPES}?userId=${userId}`)
  }

  static async getById(id: number, userId: number): Promise<Recipe> {
    return apiClient.get<Recipe>(`${API_ENDPOINTS.RECIPES}/${id}?userId=${userId}`)
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
