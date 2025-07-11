export const API_BASE_URL = "http://localhost:3001"

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
  },
  RECIPES: "/recipes",
  INGREDIENTS: "/ingredients",
  CATEGORIES: "/categories",
  FAVORITES: "/favorites",
} as const

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
  RECIPES: "/recipes",
  RECIPES_NEW: "/recipes/new",
  INGREDIENTS: "/ingredients",
  CATEGORIES: "/categories",
  FAVORITES: "/favorites",
} as const

export const COLORS = ["#2563eb", "#dc2626", "#16a34a", "#ca8a04", "#9333ea", "#c2410c", "#0891b2", "#be123c"]

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  IS_NEW_LOGIN: "isNewLogin",
} as const
