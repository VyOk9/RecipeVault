# 🧾 RecipeVault

**RecipeVault** is a full-stack recipe management application built with **Next.js** (frontend) and **NestJS** (backend), using **PostgreSQL** via **Prisma ORM** and **Redis** for performance. The entire architecture is containerized using **Docker Compose**.

---

## 📦 Tech Stack

* **Frontend**: Next.js (latest), TypeScript, Tailwind CSS
* **Backend**: NestJS (latest), TypeScript
* **Database**: PostgreSQL (via Prisma ORM)
* **Cache**: Redis
* **Authentication**: JWT-based
* **Containerization**: Docker Compose

---

## 🏗️ Project Structure

### 📡 Backend (NestJS)

```
src/
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── main.ts
├── auth/
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── jwt-auth.guard.ts
│   └── jwt.strategy.ts
├── categories/
│   ├── categories.controller.ts
│   ├── categories.module.ts
│   └── categories.service.ts
├── favorites/
│   ├── favorites.controller.ts
│   ├── favorites.module.ts
│   └── favorites.service.ts
├── ingredients/
│   ├── ingredients.controller.ts
│   ├── ingredients.module.ts
│   └── ingredients.service.ts
└── recipes/
    ├── recipes.controller.ts
    ├── recipes.module.ts
    └── recipes.service.ts
```

---

### 🌐 Frontend (Next.js)

```
src/
├── app/
│   ├── dashboard/
│   ├── categories/
│   ├── favorites/
│   ├── ingredients/
│   ├── login/
│   ├── signup/
│   ├── recipes/
│   │   ├── [id]/
│   │   └── new/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── categories/
│   ├── ingredients/
│   ├── favorites/
│   ├── recipes/
│   ├── forms/
│   ├── layout/
│   ├── ui/
│   └── common/
├── constants/
├── contexts/
├── hooks/
├── lib/
├── services/
└── types/
```

---

## 🗄️ Prisma Schema

```prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  password  String
  recipes   Recipe[]
  favorites Favorite[]
  createdAt DateTime  @default(now())
}

model Recipe {
  id           Int           @id @default(autoincrement())
  title        String
  steps        String[]
  cookTime     Int
  photoUrl     String?
  user         User          @relation(fields: [userId], references: [id])
  userId       Int
  ingredients  Ingredient[]  @relation("RecipeIngredients")
  categories   Category[]    @relation("RecipeCategories")
  favorites    Favorite[]
  createdAt    DateTime      @default(now())
}

model Ingredient {
  id       Int       @id @default(autoincrement())
  name     String    @unique
  recipes  Recipe[]  @relation("RecipeIngredients")
}

model Category {
  id       Int       @id @default(autoincrement())
  name     String
  recipes  Recipe[]  @relation("RecipeCategories")

  @@unique([name])
}

model Favorite {
  id        Int     @id @default(autoincrement())
  user      User    @relation(fields: [userId], references: [id])
  userId    Int
  recipe    Recipe  @relation(fields: [recipeId], references: [id])
  recipeId  Int
  createdAt DateTime @default(now())

  @@unique([userId, recipeId])
}
```

---

## 🐳 Docker Setup

### `docker-compose.yml`

```yaml
version: '3.9'

services:
  recipevault-postgres:
    image: postgres:16
    container_name: recipevault-postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: recipevault_db
    ports:
      - "5432:5432"
    volumes:
      - recipevault_pgdata:/var/lib/postgresql/data

  recipevault-redis:
    image: redis:alpine
    container_name: recipevault-redis
    restart: always
    ports:
      - "6379:6379"
    environment:
      REDIS_HOST: recipevault-redis
      REDIS_PORT: 6379

volumes:
  recipevault_pgdata:
```

### Setup Instructions

```bash
docker-compose up -d
```

Configure your `.env` file inside the `backend/` folder:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/recipevault_db?schema=public"
```

Then:

```bash
# Install Prisma CLI if not already
npm install prisma --save-dev
npm install @prisma/client

# Generate Prisma Client
npx prisma generate

# Apply schema to the DB
npx prisma migrate dev

# Optional: open Prisma Studio
npx prisma studio
```

---

## 🔐 Authentication

* Auth is handled via JWT
* Auth endpoints: `/auth/signup` and `/auth/login`
* Token is stored in `localStorage`
* Protected routes secured using `JwtAuthGuard` on the backend

---

## 🍽️ Features

* ✅ User signup & login
* ✅ Create / update / delete recipes
* ✅ Manage ingredients and categories
* ✅ Favorite system for recipes
* ✅ Fully responsive UI
* ✅ Separated frontend/backend architecture

---

## 🚀 Run the Project

### Backend

```bash
cd backend
npm install
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📄 License

MIT © \[Lylian Hay]
