export interface User {
  id: number
  email: string
  createdAt: string
}

export interface Category {
  id: number
  name: string
  description?: string
}

export interface Ingredient {
  id: number
  name: string
}

export interface Recipe {
  id: number
  title: string
  steps: string[]
  cookTime: number
  photoUrl?: string
  userId: number
  ingredients: Ingredient[]
  categories: Category[]
}

export interface Favorite {
  id: number
  userId: number
  recipeId: number
  recipe: Recipe
}

export interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
}

export interface AuthResponse {
  access_token: string
  user: User
}
