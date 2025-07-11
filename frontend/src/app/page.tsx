"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Bienvenue sur RecipeVault</h1>
          <p className="text-xl text-gray-600 mb-8">Organisez et gérez vos recettes de cuisine en toute simplicité</p>
        </div>

        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Commencer</CardTitle>
              <CardDescription>
                Connectez-vous ou créez un compte pour accéder à votre collection de recettes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full">
                <Link href="/login">Se connecter</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/signup">Créer un compte</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Création de recettes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Créez des fiches recettes détaillées avec ingrédients et étapes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gestion des favoris</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Marquez vos recettes préférées pour les retrouver facilement</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recherche avancée</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Recherchez par ingrédient, mot-clé ou catégorie</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
