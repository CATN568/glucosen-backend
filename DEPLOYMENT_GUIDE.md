# Glucosen Backend - DEPLOYMENT GUIDE

## 🐳 Déploiement avec Docker

### Prérequis
- Docker
- Docker Compose

### Étapes de déploiement

#### 1. Modifier les variables d'environnement
```bash
# Éditer docker-compose.yml
nano docker-compose.yml

# Remplacer :
# - POSTGRES_PASSWORD
# - DB_PASSWORD
# - JWT_SECRET
# - CORS_ORIGIN
```

#### 2. Construire et démarrer les conteneurs
```bash
# Démarrer les services
docker-compose up --build

# En arrière-plan
docker-compose up -d --build
```

#### 3. Vérifier le statut
```bash
# Voir les logs
docker-compose logs -f

# Vérifier les conteneurs
docker-compose ps
```

#### 4. Accéder à l'application
```
http://localhost:3000
http://localhost:3000/health
```

### Commandes utiles

```bash
# Arrêter les services
docker-compose down

# Supprimer les volumes (données)
docker-compose down -v

# Redémarrer
docker-compose restart

# Voir les logs
docker-compose logs -f app
docker-compose logs -f postgres

# Accéder à la base de données
docker-compose exec postgres psql -U glucosen_user -d glucosen_db
```

---

## 🚀 Déploiement sur Heroku

### Prérequis
- Compte Heroku
- CLI Heroku installée

### Étapes

#### 1. Créer l'application
```bash
heroku create your-app-name
```

#### 2. Ajouter PostgreSQL
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

#### 3. Configurer les variables d'environnement
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret_key
heroku config:set JWT_EXPIRE=7d
heroku config:set CORS_ORIGIN=your-frontend-domain.com
```

#### 4. Déployer depuis Git
```bash
git push heroku main
```

#### 5. Vérifier les logs
```bash
heroku logs --tail
```

---

## 🐳 Déploiement sur AWS/GCP/Azure

### Option 1 : AWS ECS (Elastic Container Service)

1. Créer un registre ECR
2. Pousser l'image Docker
3. Créer une tâche ECS
4. Configurer la base de données RDS PostgreSQL
5. Créer un service ECS

### Option 2 : Google Cloud Run

```bash
# Authentifier
gcloud auth login

# Construire et déployer
gcloud run deploy glucosen-backend \
  --source . \
  --platform managed \
  --memory 512Mi \
  --set-env-vars NODE_ENV=production,JWT_SECRET=your_secret
```

### Option 3 : Azure App Service

```bash
# Créer un groupe de ressources
az group create --name glucosen-rg --location eastus

# Créer un plan App Service
az appservice plan create --name glucosen-plan --resource-group glucosen-rg --sku B1 --is-linux

# Créer l'application
az webapp create --resource-group glucosen-rg --plan glucosen-plan --name glucosen-api --runtime "NODE|18-lts"

# Déployer depuis GitHub
az webapp deployment source config-zip --resource-group glucosen-rg --name glucosen-api --src deployment.zip
```

---

## 📊 Configuration de la base de données en production

### PostgreSQL Managed Services

#### AWS RDS
```sql
-- Créer l'utilisateur
CREATE USER glucosen_user WITH PASSWORD 'secure_password';

-- Créer la base
CREATE DATABASE glucosen_db OWNER glucosen_user;

-- Accorder les permissions
GRANT ALL PRIVILEGES ON DATABASE glucosen_db TO glucosen_user;
```

#### Google Cloud SQL
Utiliser Cloud Console ou gsql CLI

#### Azure Database for PostgreSQL
Utiliser Azure Portal

---

## 🔒 Configuration de sécurité en production

### 1. JWT Secret
```bash
# Générer une clé sécurisée
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Certificats SSL/TLS
- CloudFlare (gratuit)
- Let's Encrypt
- Certificate du fournisseur cloud

### 3. Limiter l'accès aux bases de données
- Firewall rules
- VPC/VPN
- SSH keys

### 4. CORS en production
```env
CORS_ORIGIN=https://your-frontend-domain.com
```

### 5. Rate Limiting
À implémenter dans le code :
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 📈 Monitoring et Logs

### Services recommandés
- **Logs:** CloudWatch, Stackdriver, Azure Monitor
- **Monitoring:** Datadog, New Relic, Prometheus
- **APM:** Elastic, Datadog, New Relic

### Exemple avec CloudWatch (AWS)
```javascript
const CloudWatchTransport = require('winston-cloudwatch');

const logger = winston.createLogger({
  transports: [
    new CloudWatchTransport({
      logGroupName: 'glucosen-api',
      logStreamName: 'api-logs'
    })
  ]
});
```

---

## 🔄 CI/CD Pipeline

### Exemple avec GitHub Actions

Créer `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - name: Deploy
        run: |
          git push heroku main
```

---

## 🧪 Load Testing

```bash
# Avec Apache Bench
ab -n 1000 -c 100 http://your-api-domain/health

# Avec wrk
wrk -t12 -c400 -d30s http://your-api-domain/health
```

---

## 📝 Checklist de déploiement

- [ ] Toutes les variables d'environnement configurées
- [ ] JWT_SECRET changée
- [ ] CORS_ORIGIN mis à jour
- [ ] Base de données créée et migrée
- [ ] SSL/TLS configuré
- [ ] Sauvegardes configurées
- [ ] Monitoring activé
- [ ] Logs configurés
- [ ] Health checks testés
- [ ] Rollback plan documenté

---

## 🆘 Troubleshooting

### Erreur de connexion à la base de données
```bash
# Vérifier les credentials
docker-compose config

# Tester la connexion
psql -h localhost -U glucosen_user -d glucosen_db
```

### Port déjà utilisé
```bash
# Changer le port dans docker-compose.yml
ports:
  - "3001:3000"
```

### Problèmes de permission
```bash
# Vérifier la propriété des fichiers
ls -la

# Accorder les permissions
chmod 755 .env
```

---

## 📞 Support

Pour plus d'aide, consulter la documentation du README.md
