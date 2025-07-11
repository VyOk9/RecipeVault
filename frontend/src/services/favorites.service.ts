import { apiClient } from "@/lib/api"
import { API_ENDPOINTS } from "@/constants"
import type { Favorite } from "@/types"

export class FavoritesService {
  static async addFavorite(userId: number, recipeId: number): Promise<Favorite> {
    return apiClient.post<Favorite>(API_ENDPOINTS.FAVORITES, { userId, recipeId })
  }

  static async getUserFavorites(userId: number): Promise<Favorite[]> {
    return apiClient.get<Favorite[]>(`${API_ENDPOINTS.FAVORITES}/user/${userId}`)
  }

  static async removeFavorite(id: number): Promise<{ deleted: boolean }> {
    return apiClient.delete<{ deleted: boolean }>(`${API_ENDPOINTS.FAVORITES}/${id}`)
  }
}
