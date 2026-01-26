# 🚀 Configuration Production - Frontend + Backend

## ✅ URLs Configurées

- **Frontend**: https://air-frontend-neon.vercel.app
- **Backend**: https://airbnb-backend.onrender.com

---

## ✅ Étape 1: Variables Vercel

**Dashboard Vercel** → `air-frontend-neon` → Settings → Environment Variables

Ajouter/Mettre à jour:
```
VITE_API_URL=https://airbnb-backend.onrender.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx (votre clé production)
```

Puis **Redeploy**:
- Deployments → Trigger Deploy

---

## ✅ Étape 2: Variables Render (Backend)

**Render Dashboard** → `airbnb-backend` → Environment

Vérifier/Mettre à jour:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://airbnb_user:d4CdJV6T8E8EIJvR@airrbnb-cluster.upznduc.mongodb.net/?appName=airrbnb-cluster
FRONTEND_URL=https://air-frontend-neon.vercel.app
JWT_SECRET=Fv9eREDpIBBKSo2JKT8F/FS8v4GgVMXMMDDGz2lOVkAjyLUFUb9vZdNN7eFduuuwkpQw9nIQI4D1Ur1FcRjMKA==
STRIPE_SECRET_KEY=sk_test_51SqkRcQNnsQlseiCnwZYUaffrChtfidCFPQENYDmZc9i0NolBFHITzINMbRlT3syegI3TW0Djn3ShmUFJ4eKdpbh00JjIXGE6P
STRIPE_PUBLISHABLE_KEY=pk_test_51SqkRcQNnsQlseiCtG1qGIEnMIT7xZJm7fm2lgwsYslKaHTO9wA2R221ZHnKxs5H6SIZS4GpniFbzP4740Mdrvkp00Z9Sz4uUX
STRIPE_WEBHOOK_SECRET=whsec_0f4d5b6a7714bc4691bda2ed739086eb82a02df686247e865af78251dc954090
```

Puis **Manual Deploy** si besoin.

---

## ✅ Étape 3: Tester Production

### Test 1: Backend Health
```bash
curl https://airbnb-backend.onrender.com/health
# Doit retourner: {"status":"OK"}
```

### Test 2: Frontend Accès Public
```
https://air-frontend-neon.vercel.app/contact
# Devrait charger sans timeout
```

### Test 3: Console Browser (F12)
```javascript
// Dans la console:
fetch('https://airbnb-backend.onrender.com/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend OK:', d))
  .catch(e => console.error('❌ Backend Error:', e))
```

---

## 📝 Configuration Appliquée Localement

✅ **backend/.env** - FRONTEND_URL corrigée:
```
FRONTEND_URL=https://air-frontend-neon.vercel.app
MONGODB_URI=mongodb+srv://... (typo corrigé)
```

✅ **backend/src/app.ts** - CORS auto-détecte FRONTEND_URL

✅ **frontend/src/config/env.ts** - API URL configurée:
```
apiBaseUrl: 'https://airbnb-backend.onrender.com/api'
```

---

## 🔧 Actions Requises

1. **Push les changements** (MONGODB_URI fix, FRONTEND_URL):
   ```bash
   git add backend/.env
   git commit -m "Fix: Correct production URLs and MongoDB URI"
   git push origin main
   ```

2. **Vercel** - Ajouter var env et redeploy

3. **Render** - Vérifier/ajouter FRONTEND_URL var env

4. **Tester** - Ouvrir https://air-frontend-neon.vercel.app/contact

---

## ✅ Statut

| Composant | Status | Action |
|-----------|--------|--------|
| Backend Config | ✅ | Push nécessaire |
| Render Env Vars | ⏳ | À ajouter via dashboard |
| Vercel Env Vars | ⏳ | À ajouter via dashboard |
| CORS Config | ✅ | Automatique |
