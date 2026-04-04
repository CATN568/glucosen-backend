# Glucosen Backend

Application backend complète pour la gestion du glucose sanguin, des repas, de l'insuline et de l'exercice physique. Construite avec **Node.js/Express** et **PostgreSQL**.

## 🚀 Fonctionnalités

- ✅ Authentification JWT
- ✅ Gestion des profils utilisateur
- ✅ Enregistrement des niveaux de glucose
- ✅ Suivi des repas et macronutriments
- ✅ Documentation des injections d'insuline
- ✅ Journalisation de l'exercice physique
- ✅ Statistiques et analyse des données
- ✅ API REST sécurisée
- ✅ Validation des données
- ✅ Gestion des erreurs complète

## 📋 Prérequis

- Node.js >= 14.x
- PostgreSQL >= 12.x
- npm ou yarn

## 🛠️ Installation

### 1. Cloner le repository

```bash
git clone https://github.com/CATN568/glucosen-backend.git
cd glucosen-backend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Créer un fichier `.env` basé sur `.env.example` :

```bash
cp .env.example .env
```

Modifier `.env` avec vos configurations :

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=glucosen_db
DB_USER=glucosen_user
DB_PASSWORD=your_secure_password

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3001,http://localhost:5173
```

### 4. Créer la base de données PostgreSQL

```bash
# Accéder à PostgreSQL
psql -U postgres

# Créer l'utilisateur
CREATE USER glucosen_user WITH PASSWORD 'your_secure_password';

# Créer la base de données
CREATE DATABASE glucosen_db OWNER glucosen_user;

# Donner les permissions
GRANT ALL PRIVILEGES ON DATABASE glucosen_db TO glucosen_user;

# Quitter
\q
```

### 5. Démarrer l'application

```bash
# Mode développement (avec rechargement automatique)
npm run dev

# Mode production
npm start
```

L'application sera disponible sur `http://localhost:3001`

## 📚 Documentation de l'API

### Health Check

```http
GET /health
```

**Réponse:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-29T10:00:00.000Z"
}
```

---

## 🔐 Endpoints d'Authentification

### Créer un compte

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "tidjnjaay@gmail.com",
  "password": "112211#Laftiet",
  "firstName": "Cheikh-Ahmed-Tidiane",
  "lastName": "Ndiaye",
  "dateOfBirth": "1957-07-05"
}
```

**Réponse (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "tidjnjaay@gmail.com",
    "firstName": "Cheikh-Ahmed-Tidiane",
    "lastName": "Ndiaye"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Se connecter

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "tidjnjaay@gmail.com",
  "password": "112211#Laftiet"
}
```

**Réponse (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "tidjnjaay@gmail.com",
    "firstName": "Cheikh-Ahmed-Tidiane",
    "lastName": "Ndiaye"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Obtenir son profil

```http
GET /api/auth/profile
Authorization: Bearer {token}
```

**Réponse (200):**
```json
{
  "user": {
    "id": 1,
    "email": "tidjnjaay@gmail.com",
    "firstName": "Cheikh-Ahmed-Tidiane",
    "lastName": "Ndiaye",
    "dateOfBirth": "1957-07-05",
    "createdAt": "2026-03-29T10:00:00.000Z"
  }
}
```

### Mettre à jour son profil

```http
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "Cheikh-Ahmed-Tidiane",
  "lastName": "Ndiaye",
  "dateOfBirth": "1957-05-05"
}
```

**Réponse (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "email": "tidjnjaay@gmail.com",
    "firstName": "Cheikh-Ahmed-Ndiaye",
    "lastName": "Ndiaye",
    "dateOfBirth": "1957-07-05"
  }
}
```

---

## 📊 Endpoints Glucose

### Créer une lecture de glucose

```http
POST /api/glucose
Authorization: Bearer {token}
Content-Type: application/json

{
  "glucoseLevel": 145,
  "readingTime": "2026-03-29T10:30:00Z",
  "unit": "mg/dL",
  "notes": "Avant le déjeuner"
}
```

**Réponse (201):**
```json
{
  "message": "Glucose reading created successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "glucose_level": 145,
    "unit": "mg/dL",
    "notes": "Avant le déjeuner",
    "reading_time": "2026-03-29T10:30:00Z",
    "created_at": "2026-03-29T10:30:00Z"
  }
}
```

### Obtenir les lectures de glucose

```http
GET /api/glucose?limit=30&offset=0
Authorization: Bearer {token}
```

**Réponse (200):**
```json
{
  "data": [
    {
      "id": 1,
      "glucose_level": 145,
      "unit": "mg/dL",
      "reading_time": "2026-03-29T10:30:00Z"
    }
  ],
  "count": 1
}
```

### Obtenir les lectures par période

```http
GET /api/glucose/range?startDate=2026-03-01&endDate=2026-03-31
Authorization: Bearer {token}
```

### Obtenir les statistiques

```http
GET /api/glucose/statistics?days=30
Authorization: Bearer {token}
```

**Réponse (200):**
```json
{
  "statistics": {
    "averageGlucose": "135.50",
    "minGlucose": 98,
    "maxGlucose": 245,
    "stdDev": "35.20",
    "totalReadings": 45,
    "period": "30 days"
  }
}
```

### Mettre à jour une lecture

```http
PUT /api/glucose/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "glucoseLevel": 150,
  "readingTime": "2026-03-29T10:30:00Z",
  "notes": "Après le repas"
}
```

### Supprimer une lecture

```http
DELETE /api/glucose/{id}
Authorization: Bearer {token}
```

---

## 🍽️ Endpoints Repas

### Créer un repas

```http
POST /api/meals
Authorization: Bearer {token}
Content-Type: application/json

{
  "mealType": "breakfast",
  "mealTime": "2026-03-29T08:00:00Z",
  "description": "Oeufs et pain grillé",
  "carbs": 45,
  "protein": 15,
  "fat": 12,
  "calories": 350
}
```

### Obtenir les repas

```http
GET /api/meals?limit=30&offset=0
Authorization: Bearer {token}
```

### Obtenir les repas par période

```http
GET /api/meals/range?startDate=2026-03-01&endDate=2026-03-31
Authorization: Bearer {token}
```

### Mettre à jour un repas

```http
PUT /api/meals/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "mealType": "breakfast",
  "carbs": 50
}
```

### Supprimer un repas

```http
DELETE /api/meals/{id}
Authorization: Bearer {token}
```

---

## 💉 Endpoints Insuline

### Créer un journal d'insuline

```http
POST /api/insulin
Authorization: Bearer {token}
Content-Type: application/json

{
  "insulinType": "Humalog",
  "units": 10,
  "administrationTime": "2026-03-29T08:00:00Z",
  "notes": "Avant le petit-déjeuner"
}
```

### Obtenir les journaux d'insuline

```http
GET /api/insulin?limit=30&offset=0
Authorization: Bearer {token}
```

### Obtenir les journaux par période

```http
GET /api/insulin/range?startDate=2026-03-01&endDate=2026-03-31
Authorization: Bearer {token}
```

### Obtenir le total d'insuline quotidienne

```http
GET /api/insulin/daily-total?date=2026-03-29
Authorization: Bearer {token}
```

**Réponse (200):**
```json
{
  "date": "2026-03-29",
  "totalUnits": 25
}
```

### Mettre à jour un journal

```http
PUT /api/insulin/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "units": 12,
  "notes": "Dosage ajusté"
}
```

### Supprimer un journal

```http
DELETE /api/insulin/{id}
Authorization: Bearer {token}
```

---

## 🏃 Endpoints Exercice

### Créer un journal d'exercice

```http
POST /api/exercise
Authorization: Bearer {token}
Content-Type: application/json

{
  "activityType": "running",
  "durationMinutes": 30,
  "intensity": "moderate",
  "exerciseTime": "2026-03-29T17:00:00Z",
  "caloriesBurned": 250,
  "notes": "Course dans le parc"
}
```

### Obtenir les journaux d'exercice

```http
GET /api/exercise?limit=30&offset=0
Authorization: Bearer {token}
```

### Obtenir les journaux par période

```http
GET /api/exercise/range?startDate=2026-03-01&endDate=2026-03-31
Authorization: Bearer {token}
```

### Obtenir les statistiques d'exercice

```http
GET /api/exercise/statistics?days=30
Authorization: Bearer {token}
```

**Réponse (200):**
```json
{
  "statistics": {
    "totalDuration": 450,
    "totalCalories": 3500,
    "totalSessions": 15,
    "avgDuration": "30.00",
    "period": "30 days"
  }
}
```

### Mettre à jour un journal

```http
PUT /api/exercise/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "durationMinutes": 40,
  "caloriesBurned": 280
}
```

### Supprimer un journal

```http
DELETE /api/exercise/{id}
Authorization: Bearer {token}
```

---

## 📂 Structure du Projet

```
glucosen-backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Configuration PostgreSQL
│   │   └── initDb.js            # Initialisation des tables
│   ├── models/
│   │   ├── User.js              # Modèle utilisateur
│   │   ├── GlucoseReading.js    # Modèle lectures de glucose
│   │   ├── Meal.js              # Modèle repas
│   │   ├── Insulin.js           # Modèle insuline
│   │   └── Exercise.js          # Modèle exercice
│   ├── controllers/
│   │   ├── authController.js    # Logique authentification
│   │   ├── glucoseController.js # Logique glucose
│   │   ├── mealController.js    # Logique repas
│   │   ├── insulinController.js # Logique insuline
│   │   └── exerciseController.js # Logique exercice
│   ├── routes/
│   │   ├── auth.js              # Routes authentification
│   │   ├── glucose.js           # Routes glucose
│   │   ├── meals.js             # Routes repas
│   │   ├── insulin.js           # Routes insuline
│   │   └── exercise.js          # Routes exercice
│   ├── middleware/
│   │   ├── auth.js              # Middleware JWT
│   │   └── errorHandler.js      # Gestion des erreurs
│   ├── utils/
│   │   └── validators.js        # Validateurs
│   └── app.js                   # Configuration Express
├── index.js                     # Point d'entrée
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 🔒 Sécurité

- ✅ Passwords hashés avec bcrypt
- ✅ JWT pour l'authentification sans état
- ✅ Helmet pour les headers de sécurité
- ✅ CORS configuré
- ✅ Validation des entrées
- ✅ Gestion des erreurs sécurisée

---

## 🐛 Dépannage

### Erreur de connexion PostgreSQL
```
Vérifier que PostgreSQL est en cours d'exécution et que les identifiants dans .env sont corrects.
```

### Port 3000 déjà utilisé
```bash
# Changer le port dans .env
PORT=3001
```

### Erreur JWT
```
Vérifier qu'un token valide est inclus dans le header Authorization : Bearer {token}
```

---

## 📝 License

ISC

---

## 👨‍💻 Auteur

CATN568

---

## 📧 Support

Pour toute question ou problème, ouvrir une issue sur le repository GitHub.
