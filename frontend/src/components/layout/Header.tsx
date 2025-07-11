"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants"

interface HeaderProps {
  currentPage?: string
  onLogout?: () => void
  user?: { email: string } | null
}

export function Header({ currentPage, onLogout, user }: HeaderProps) {
  const navItems = [
    { href: ROUTES.DASHBOARD, label: "Tableau de bord", key: "dashboard" },
    { href: ROUTES.RECIPES, label: "Recettes", key: "recipes" },
    { href: ROUTES.INGREDIENTS, label: "Ingrédients", key: "ingredients" },
    { href: ROUTES.CATEGORIES, label: "Catégories", key: "categories" },
    { href: ROUTES.FAVORITES, label: "Favoris", key: "favorites" },
  ]

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">RecipeVault</h1>

        <nav className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`${
                currentPage === item.key ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {user && <span className="text-sm text-gray-600">Bienvenue, {user.email.split("@")[0]}</span>}
          <Button onClick={onLogout} variant="outline" size="sm">
            Déconnexion
          </Button>
        </div>
      </div>
    </header>
  )
}
