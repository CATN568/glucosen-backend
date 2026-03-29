# Professional Deployment Guide - Glucosen Backend

## 🚀 Architecture de Déploiement

```
┌─────────────────────────────────────────────────────────────┐
│                   GitHub Repository                          │
│              (Code + CI/CD Workflows)                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
        ┌─────────────────────────────┐
        │   GitHub Actions CI/CD      │
        │  ├─ Lint & Validation       │
        │  ├─ Security Checks         │
        │  ├─ Build Docker Image      │
        │  └─ Deploy & Tests          │
        └──────────────┬──────────────┘
                       │
        ┌──────────────┴──────────────┐
        ▼                             ▼
   ┌─────────────┐         ┌──────────────────┐
   │   Railway   │         │  Container Reg.  │
   │  (App Prod) │         │   (Docker Image) │
   └─────┬───────┘         └──────────────────┘
         │
   ┌─────┴─────────────┐
   ▼                   ▼
┌──────────────┐  ┌─────────────────────┐
│  PostgreSQL  │  │  Monitoring/Logs    │
│  (Railway)   │  │  (Datadog/NewRelic) │
└──────────────┘  └─────────────────────┘
```

---

## 📋 Configuration initiale

### 1. Variables d'environnement GitHub Secrets

Ajouter dans GitHub Settings → Secrets and variables → Actions:

```
RAILWAY_TOKEN              # Token Railway API
RAILWAY_PROJECT_ID         # ID du projet Railway
RAILWAY_DOMAIN            # Domaine de l'app (ex: glucosen-api.up.railway.app)
SLACK_WEBHOOK             # Webhook Slack pour notifications
DOCKER_REGISTRY_USERNAME  # Username registry (optionnel)
DOCKER_REGISTRY_PASSWORD  # Password registry (optionnel)
```

### 2. Configuration Railway

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Se connecter
railway login

# Initialiser le projet
railway init

# Ajouter PostgreSQL
railway add --database postgresql

# Configurer les variables
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=$(openssl rand -hex 32)
railway variables set JWT_EXPIRE=7d

# Voir le statut
railway status
```

---

## 🔄 Pipeline CI/CD Détaillé

### Étape 1: Lint & Validation
```yaml
✓ Checkout code
✓ Setup Node.js 18
✓ Cache npm dependencies
✓ Check syntax de tous les fichiers JS
✓ Valider les configurations
```

### Étape 2: Security Checks
```yaml
✓ npm audit - Vérifier les vulnérabilités
✓ gitleaks - Détecter les secrets en dur
✓ Analyse des dépendances
```

### Étape 3: Build Docker Image
```yaml
✓ Setup Docker Buildx
✓ Login à GitHub Container Registry
✓ Build image multi-stage
✓ Push image avec tags (main, latest, SHA)
✓ Cache les couches Docker
```

### Étape 4: Deploy
```yaml
✓ Link projet Railway
✓ Push à Railway
✓ Health check après déploiement
✓ Notifications Slack
```

### Étape 5: Smoke Tests
```yaml
✓ Attendre 10 secondes (warm-up)
✓ GET /health
✓ Valider la réponse
✓ Log des résultats
```

---

## 🐳 Build Docker Optimisé

Le `Dockerfile` fourni utilise:
- **Multi-stage build** - Réduire la taille de l'image
- **Alpine Linux** - Base légère (5MB vs 900MB)
- **Health checks** - Monitoring automatique
- **Layering optimisé** - Cache efficace

### Tailles d'image
- Base Alpine: ~5 MB
- Node 18 Alpine: ~165 MB
- Final image: ~200 MB

---

## 📊 Monitoring & Observabilité

### Logs
```bash
# Railway
railway logs --follow

# Docker
docker logs -f glucosen-app
```

### Health Monitoring
```javascript
// Le endpoint /health retourne:
{
  "status": "ok",
  "timestamp": "2026-03-29T10:00:00Z",
  "uptime": 3600,
  "database": "connected"
}
```

### Métriques recommandées
- Response time
- Error rate
- Database connections
- Memory usage
- CPU usage

---

## 🔐 Sécurité en Production

### 1. Environment Variables
```env
✓ JWT_SECRET = Générée aléatoirement (32 bytes)
✓ DB_PASSWORD = Sécurisée, jamais commitée
✓ NODE_ENV = production
✓ CORS_ORIGIN = Frontend domain précis
```

### 2. Database Security
```sql
-- Chiffrage
PGCRYPTO extension activée

-- Backup automatique
Railway gère les backups

-- Connection SSL
SSL activé par défaut
```

### 3. API Security
```javascript
helmet.js         // Headers de sécurité
CORS config       // Origines autorisées
Rate limiting     // À implémenter (voir TODO)
Input validation  // Tous les endpoints
Password hashing  // bcryptjs
```

### 4. Infrastructure
```
✓ HTTPS/TLS obligatoire
✓ Firewall configuré
✓ DDoS protection (Railway)
✓ Secrets rotés régulièrement
✓ Accès SSH par clés uniquement
```

---

## 📈 Scaling & Performance

### Horizontal Scaling
```bash
# Railway gère l'auto-scaling
# Configurable dans Railway Dashboard
```

### Caching Strategy
```javascript
// À implémenter:
// - Redis pour sessions
// - ETags pour les réponses
// - HTTP cache headers
```

### Database Optimization
```sql
EXPLAIN ANALYZE SELECT ... -- Analyser les queries
CREATE INDEX idx_user_email ON users(email);
VACUUM ANALYZE;  -- Optimiser la BD
```

---

## 🔄 Rollback & Recovery

### Automatic Rollback
```bash
# Si health check échoue:
railway rollback --to previous-deployment
```

### Manual Rollback
```bash
# Voir l'historique des déploiements
railway logs --deployment

# Rollback à un commit spécifique
git revert <commit-hash>
git push origin main  # Redéploie automatiquement
```

### Backup & Restore
```bash
# Exporter la base
pg_dump -h host -U user -d db > backup.sql

# Restaurer
psql -h host -U user -d db < backup.sql
```

---

## 📞 Support & Troubleshooting

### Logs en Production
```bash
# Erreurs récentes
railway logs --error

# Suivre en temps réel
railway logs --follow

# Filtrer par niveau
railway logs --level error
```

### Health Check
```bash
curl https://glucosen-api.up.railway.app/health
# Devrait retourner: {"status": "ok", ...}
```

### Database Connectivity
```bash
# Vérifier la connexion BD
railway postgres:connect

# Tester une query
SELECT NOW();
```

### Memory Issues
```javascript
// Vérifier en production
console.log(process.memoryUsage());

// Limiter sur Railway
// Settings → Max Memory: 512 MB
```

---

## 🎯 Checklist Final

```
PRÉ-DÉPLOIEMENT:
□ Tous les secrets en GitHub Secrets
□ Railway project créé et configuré
□ Variables d'environnement définies
□ Slack webhook configuré (optionnel)
□ Git branch protection activée
□ Code review process défini

DÉPLOIEMENT:
□ Push sur main branche
□ GitHub Actions s'exécute
□ Lint/Security pass
□ Docker image build
□ Deploy à Railway
□ Smoke tests pass
□ Slack notification reçue

POST-DÉPLOIEMENT:
□ API répond aux requêtes
□ Health check success
□ Logs sans erreurs critiques
□ Database connectivity OK
□ Tous les endpoints testés

MONITORING:
□ Alertes configurées
□ Logs centralisés
□ Metrics dashboards
□ Backup automatique activé
□ Plan de rollback documenté
```

---

## 📚 Ressources

- [Railway Docs](https://docs.railway.app)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

---

## 🚀 Commandes Utiles

```bash
# Déployer manuellement
railway up

# Voir les déploiements
railway deployments list

# Logs en temps réel
railway logs -f

# SSH dans le container
railway shell

# Reset du projet
railway reset

# Voir les variables
railway variables

# Activer le domain personnalisé
railway domain --add
```

---

**Status:** ✅ Production Ready
**Last Updated:** 2026-03-29
**Maintained by:** DevOps Team
