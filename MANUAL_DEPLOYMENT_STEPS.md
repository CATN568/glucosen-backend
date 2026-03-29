# 🚀 DÉPLOIEMENT MANUEL - ÉTAPES INTERACTIVES

## ✅ Préparation Complète

Railway CLI est installé et prêt! ✅

```
railway v4.35.0
```

---

## 📋 PROCHAINES ÉTAPES (À Faire Maintenant)

### ÉTAPE 1: Se Connecter à Railway (5 min)

```bash
railway login
```

**Cela va:**
1. Ouvrir votre navigateur
2. Vous demander d'autoriser l'accès GitHub
3. Générer un token
4. Vous le montrer d'autoriser dans le terminal

**Après succès:**
```bash
✅ Successfully logged in as [votre-username]
```

---

### ÉTAPE 2: Initialiser le Projet Railway (2 min)

```bash
cd /workspaces/glucosen-backend
railway init
```

**Cela va demander:**
```
? Enter your project name (optional): 
→ glucosen-api
```

**Résultat attendu:**
- Créé `.railway/config.json`
- Lié votre repo

---

### ÉTAPE 3: Ajouter PostgreSQL Database (2 min)

```bash
railway add
```

**Cela va afficher un menu:**
```
? Select service to add:
  ❯ Postgres (select this one!)
    MySQL
    Redis
    MongoDB
```

**Sélectionnez: Postgres** (flèche bas + Enter)

**Cela crée:**
- PostgreSQL managed instance
- `DATABASE_URL` env variable automatique

---

### ÉTAPE 4: Configurer les Variables d'Environnement (3 min)

```bash
# Set environment variables
railway variables set NODE_ENV=production
railway variables set PORT=8080
railway variables set CORS_ORIGIN="*"

# Générer JWT secret sécurisé
JWT_SECRET=$(openssl rand -hex 32)
railway variables set JWT_SECRET="$JWT_SECRET"

# Afficher ce qui a été configuré
railway variables
```

**Vous verrez:**
```
NODE_ENV               production
PORT                   8080
CORS_ORIGIN            *
JWT_SECRET             [long hex string]
DATABASE_URL           postgres://user:pass@...
```

---

### ÉTAPE 5: Pousser les Commits vers GitHub (1 min)

```bash
git push -u origin main
```

**Vérifie que vos commits sont sur GitHub**

---

### ÉTAPE 6: Déployer en Production (5 min + attente)

```bash
railway up
```

**Cela va:**
1. Déterminer le Dockerfile à utiliser
2. Build l'image Docker
3. Pousser vers Railway
4. Démarrer les conteneurs
5. Initialiser la base de données

**En attente de success:**
```
✅ Deployment successful
🎉 Your app is live at: https://glucosen-api-xxxxx.up.railway.app
```

---

### ÉTAPE 7: Vérifier que c'est Actif (2 min)

```bash
# Obtenir l'URL de production
railway environment

# Test health endpoint
PROD_URL=$(railway environment | grep -oP 'https://[^\s]+' | head -1)
curl $PROD_URL/api/health
```

**Résultat attendu:**
```json
{"status":"ok"}
```

---

### ÉTAPE 8: Test l'Authentification (2 min)

```bash
# Register un nouvel utilisateur
curl -X POST $PROD_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"SecurePass123!",
    "name":"Test User"
  }'
```

**Résultat attendu:**
```json
{
  "user": {
    "id": 1,
    "email": "test@example.com",
    "name": "Test User",
    ...
  },
  "token": "eyJhbGc..."
}
```

---

## ✨ RÉSUMÉ - Temps Total: ~30 minutes

| Étape | Temps | Status |
|-------|-------|--------|
| 1. railway login | 5 min | ⏳ Vous êtes ici |
| 2. railway init | 2 min | ⏳ Next |
| 3. railway add (Postgres) | 2 min | ⏳ Next |
| 4. Variables d'env | 3 min | ⏳ Next |
| 5. git push | 1 min | ⏳ Next |
| 6. railway up | 5 min | ⏳ Next |
| 7. Vérifier | 2 min | ⏳ Next |
| 8. Test auth | 2 min | ⏳ Next |
| **TOTAL** | **~30 min** | ✅ LIVE |

---

## 🎯 COMMAND COPY-PASTE (Tout d'un coup)

Vous pouvez copier-coller ceci pour aller vite:

```bash
# Step 1: Login
railway login

# Step 2: Init
cd /workspaces/glucosen-backend
railway init
# Type: glucosen-api

# Step 3: Add Postgres (select from menu)
railway add
# Select: Postgres

# Step 4: Set env vars
railway variables set NODE_ENV=production
railway variables set PORT=8080
railway variables set CORS_ORIGIN="*"
railway variables set JWT_SECRET=$(openssl rand -hex 32)

# Verify
railway variables

# Step 5: Push to GitHub
git push -u origin main

# Step 6: Deploy!
railway up

# Step 7: Test
PROD_URL=$(railway environment | grep -oP 'https://[^\s]+' | head -1)
echo "Your API: $PROD_URL"
curl $PROD_URL/api/health

# Step 8: Test register
curl -X POST $PROD_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"SecurePass123!",
    "name":"Test User"
  }'
```

---

## ⚠️ POINTS IMPORTANTS

**Que Railway va créer automatiquement:**
- ✅ Domain URL unique (glucosen-api-xxxxx.up.railway.app)
- ✅ PostgreSQL database
- ✅ Managed backups
- ✅ Auto-scaling (sur tiers payant)
- ✅ SSL/HTTPS

**Que vous devez fournir:**
- ✅ GitHub account (pour login Railway)
- ✅ 5-10 minutes de votre temps
- ✅ Répondre aux prompts interactifs

---

## 🆘 TROUBLESHOOTING

### "railway: command not found"
```bash
# Réinstaller
npm install -g @railway/cli

# Vérifier
railway --version
```

### "Not authenticated" après railway login
```bash
# Vérifier le token
railway whoami

# Si erreur, réessayer:
railway logout
railway login
```

### "Build failed" during railway up
```bash
# Voir les logs détaillés
railway logs --follow

# Problèmes communs:
# - npm install échouée → vérifier package.json
# - Port mismatch → vérifier PORT=8080
# - Missing env → vérifier DATABASE_URL
```

### "Health check failed" après deployment
```bash
# Attendre 2-3 minutes (encore en démarrage)
sleep 180

# Tester encore
curl $PROD_URL/api/health

# Voir logs
railway logs --follow --service api
```

---

## ✅ SUCCESS CHECKLIST

Après toutes les étapes:

- [ ] railway login réussi
- [ ] railway init réussi
- [ ] Postgres ajouté
- [ ] Variables d'env configurées
- [ ] git push successful
- [ ] railway up réussi
- [ ] Health check: `curl $PROD_URL/api/health → 200 OK`
- [ ] Register test réussi → reçu un token

---

## 🎉 APRÈS DÉPLOIEMENT

**Félicitations! Votre API est LIVE! 🎊**

Vous avez maintenant:

✅ **Production API:** `https://glucosen-api-xxxxx.up.railway.app`

✅ **Users peuvent:**
- Créer compte
- Se connecter
- Tracker glucose (et plus)

✅ **Next Steps:**
1. Développer P1 features en branche `features/p1-features`
2. Merge vers `main` pour redéployer
3. Weekly deploys pour nouvellesfeatures

---

## 📞 BESOIN D'AIDE?

**Docs:**
- Railway: https://docs.railway.app
- API: Voir README.md dans le repo
- Git: Voir GITFLOW_WORKFLOW.md

**Contacts:**
- Railway Support: https://railway.app/support
- GitHub Repo: https://github.com/CATN568/glucosen-backend

C'est prêt! Commencez par: `railway login` 🚀
