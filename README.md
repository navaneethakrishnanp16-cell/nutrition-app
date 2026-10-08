# Personalized Nutrition & Fitness Calculator Web Application

A full-stack, production-ready, Dockerized **Personalized Nutrition & Fitness Calculator Web Application** built with React, TypeScript, Vite, Tailwind CSS, Recharts, Express REST API, PostgreSQL, and Docker containerization.

---

## 1. Project Overview

The **NutriFit Engine** allows users to enter body metrics, select detailed physical activity levels, and choose primary fitness goals to receive personalized daily calorie, macronutrient, micronutrient, fluid, and fiber recommendations.

It includes:
- **Scientific BMR & TDEE Calculations**: Mifflin-St Jeor formula with activity multipliers.
- **Activity-Based Protein Allocation**: Grams per kg body weight custom tailored to training discipline.
- **Visual Analytics**: Interactive Recharts Donut Macro split & Calorie Expenditure bar charts.
- **Curated Indian Food Database**: High-protein Indian foods (Paneer, Chicken, Soy Chunks, Tadka Dal, Idli, Chapati, Almonds, etc.).
- **Dynamic Sample Meal Planner**: 4-meal daily target planner matching daily energy goals.
- **Production DevOps**: Multi-stage Dockerfiles, Nginx SPA routing, reverse proxying, and Docker Compose orchestration.

---

## 2. Key Features

- **Wizard UI**: Step-by-step body metrics, activity cards, and fitness goal selection.
- **Mandatory & Optional Inputs**: Weight and activity mandatory; Height, Age, and Gender optional with smart BMR fallbacks.
- **Goal Adjustments**: Calorie deficit/surplus logic for Weight Loss, Muscle Gain, Weight Gain, Maintenance, and Athletic Performance.
- **Recharts Visualizations**: Donut chart for macro calorie breakdown, bar charts for energy expenditure.
- **Micronutrient DRI Table**: Guidelines for Calcium, Iron, Magnesium, Potassium, Sodium, Vitamin D, C, B12, Folate, and Zinc.
- **Resilient Architecture**: Zero-downtime client-side fallback engine if backend database is booting up.

---

## 3. Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons |
| **Backend** | Node.js, Express, TypeScript, PG (PostgreSQL client) |
| **Database** | PostgreSQL 15 |
| **Server & Proxy** | Nginx Alpine |
| **Containers** | Docker, Docker Compose |

---

## 4. Folder Structure

```
nutrition-app/
├── frontend/                  # React + TypeScript + Vite + Tailwind UI
│   ├── src/
│   │   ├── components/        # Header, StepIndicator, BodyInfoStep, ActivityStep, GoalStep, ResultsDashboard, etc.
│   │   ├── services/          # API fetch services
│   │   ├── types/             # TypeScript data contracts
│   │   ├── utils/             # Client calculation engine fallback
│   │   ├── App.tsx            # Main application controller
│   │   └── index.css          # Design system & Tailwind styling
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                   # Express REST API Service
│   ├── src/
│   │   ├── controllers/       # API route handler methods
│   │   ├── services/          # BMR/TDEE calculation engine & meal planner logic
│   │   ├── models/            # Shared data contracts
│   │   ├── data/              # Indian Food Database items
│   │   ├── database/          # PostgreSQL database connection pool
│   │   ├── routes/            # REST API router
│   │   └── index.ts           # Server main entry point
│   ├── package.json
│   └── tsconfig.json
│
├── docker/                    # DevOps container setup
│   ├── Dockerfile.frontend    # Multi-stage Nginx React builder
│   ├── Dockerfile.backend     # Multi-stage Node.js Express builder
│   ├── nginx.conf             # Nginx reverse proxy & SPA config
│   └── init.sql               # PostgreSQL schema & Indian food seed script
│
├── docker-compose.yml         # Local Docker orchestration
├── .env.example               # Environment variables template
├── .dockerignore
└── README.md
```

---

## 5. Local Development (Without Docker)

### Prerequisites
- Node.js (v18+)
- PostgreSQL (Optional, fallback supported)

### Step 1: Start Backend API
```bash
cd backend
npm install
npm run dev
```
Backend API will start at: `http://localhost:5000`

### Step 2: Start Frontend Application
```bash
cd frontend
npm install
npm run dev
```
Frontend Web Application will start at: `http://localhost:3000`

---

## 6. Docker Setup & Local Orchestration

Run the complete multi-container architecture (Frontend + Backend + PostgreSQL) with a single command:

### 1. Build Docker Images
```bash
docker compose build
```

### 2. Run Containers in Detached Mode
```bash
docker compose up -d
```

### 3. Check Container Status
```bash
docker compose ps
```

### 4. View Container Logs
```bash
docker compose logs -f
```

### 5. Stop Containers
```bash
docker compose down
```

Access the Dockerized Application:
- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000/api/health`
- **PostgreSQL Database**: `localhost:5432`

---

## 7. Docker Hub Setup & Container Registry Workflow

To push the built Docker images to Docker Hub or AWS ECR, follow these steps:

> **Note**: Replace `<YOUR_DOCKERHUB_USERNAME>` with your actual Docker Hub username.

```bash
# 1. Log in to Docker Hub
docker login

# 2. Tag Frontend Image
docker tag nutrition-app-frontend:latest <YOUR_DOCKERHUB_USERNAME>/nutrition-app-frontend:latest
docker tag nutrition-app-frontend:latest <YOUR_DOCKERHUB_USERNAME>/nutrition-app-frontend:v1.0.0

# 3. Tag Backend Image
docker tag nutrition-app-backend:latest <YOUR_DOCKERHUB_USERNAME>/nutrition-app-backend:latest
docker tag nutrition-app-backend:latest <YOUR_DOCKERHUB_USERNAME>/nutrition-app-backend:v1.0.0

# 4. Push Images to Container Registry
docker push <YOUR_DOCKERHUB_USERNAME>/nutrition-app-frontend:latest
docker push <YOUR_DOCKERHUB_USERNAME>/nutrition-app-frontend:v1.0.0
docker push <YOUR_DOCKERHUB_USERNAME>/nutrition-app-backend:latest
docker push <YOUR_DOCKERHUB_USERNAME>/nutrition-app-backend:v1.0.0
```

---

## 8. Cloud Architecture & Deployment Guide

```
+-------------------------------------------------------------------------+
|                              USER BROWSER                               |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                  CLOUD FRONTEND CONTAINER SERVICE                       |
|           (AWS App Runner / Render / AWS ECS / DigitalOcean)            |
+-------------------------------------------------------------------------+
                                     |
                          /api REST API Calls
                                     v
+-------------------------------------------------------------------------+
|                   CLOUD BACKEND API CONTAINER SERVICE                   |
|                   (Node.js Express / Docker Container)                  |
+-------------------------------------------------------------------------+
                                     |
                              SQL Connections
                                     v
+-------------------------------------------------------------------------+
|                      MANAGED POSTGRESQL DATABASE                        |
|                     (AWS RDS Postgres / Render DB)                      |
+-------------------------------------------------------------------------+
```

### Deployment Steps (e.g., Render / AWS App Runner / Railway)
1. **Database**: Provision a Managed PostgreSQL database instance and retrieve the `DATABASE_URL`.
2. **Backend**: Deploy the `<YOUR_DOCKERHUB_USERNAME>/nutrition-app-backend:latest` image to AWS App Runner or Render Web Service. Set environment variables:
   - `DATABASE_URL`: Managed Postgres Connection String
   - `PORT`: 5000
3. **Frontend**: Deploy `<YOUR_DOCKERHUB_USERNAME>/nutrition-app-frontend:latest` to container hosting. Set `VITE_API_URL` to point to your live backend domain.

---

## 9. API Endpoints Specification

### `POST /api/nutrition/calculate`
Calculates daily nutritional targets.

**Request Payload**:
```json
{
  "weight": 70,
  "height": 175,
  "age": 25,
  "gender": "male",
  "activity": "gym",
  "goal": "muscle_gain"
}
```

**Response Payload**:
```json
{
  "calories": 2686,
  "protein": { "grams": 140, "perKg": 2.0, "calories": 560, "percentage": 21 },
  "carbohydrates": { "grams": 361, "perKg": 5.16, "calories": 1444, "percentage": 54 },
  "fat": { "grams": 75, "perKg": 1.07, "calories": 675, "percentage": 25 },
  "fiber": { "grams": 38, "range": "35–43 g/day" },
  "water": { "liters": 2.8, "range": "2.5–3.3 L/day" },
  "micronutrients": {
    "calciumMg": 1000,
    "ironMg": 10,
    "magnesiumMg": 420,
    "potassiumMg": 3400,
    "sodiumMg": 2000,
    "vitaminDIu": 600,
    "vitaminCMg": 90,
    "vitaminB12Mcg": 2.4,
    "folateMcg": 400,
    "zincMg": 11
  },
  "disclaimer": "These calculations provide general nutritional estimates for healthy adults and are not medical advice."
}
```

### `GET /api/foods`
Retrieves curated food items with optional category query (`?category=protein`).

### `POST /api/meal-plan/generate`
Generates a 4-meal sample plan for target calories and protein goals.

---

## 10. Health Disclaimer

> **Important**: These calculations provide general nutritional estimates for healthy adults and are not medical advice. Individual requirements vary based on health conditions, medications, training load, and other factors. Consult a qualified healthcare professional or registered dietitian for personalized advice.
