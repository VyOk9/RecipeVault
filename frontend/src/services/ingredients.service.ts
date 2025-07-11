import { apiClient } from "@/lib/api"
import { API_ENDPOINTS } from "@/constants"
import type { Ingredient } from "@/types"

export class IngredientsService {
  static async getAll(): Promise<Ingredient[]> {
    return apiClient.get<Ingredient[]>(API_ENDPOINTS.INGREDIENTS)
  }

  static async create(name: string): Promise<Ingredient> {
    return apiClient.post<Ingredient>(API_ENDPOINTS.INGREDIENTS, { name })
  }
}
