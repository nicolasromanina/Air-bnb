# ⚡ Quick Test Commands

## 🚀 Démarrage Rapide

### 1. Démarrer les serveurs
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend  
npm install
npm run dev
```

Accédez à:
- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- Stripe: https://dashboard.stripe.com/test/payments

---

## 🧪 Tests Quick API

### Test 1: Récupérer infos Stripe complètes
```bash
curl -X GET \"http://localhost:8080/api/payments/stripe-session/cs_test_b1kbP9grbC95PKtgPXn66yAqIg2Nvk0qx4SMticHpxckhN36Sf4uV3lBmy\" \\
  -H \"Content-Type: application/json\" | jq .
```

**Attendu:** 
```json
{
  "success": true,
  "session": { "id": "cs_test_...", "status": "paid", ... },
  "payment": { "_id": "...", "status": "paid", ... }
}
```

---

### Test 2: Vérifier le paiement
```bash
curl -X POST \"http://localhost:8080/api/payments/verify\" \\
  -H \"Content-Type: application/json\" \\
  -d '{\"sessionId\":\"cs_test_b1kbP9grbC95PKtgPXn66yAqIg2Nvk0qx4SMticHpxckhN36Sf4uV3lBmy\"}'  | jq .
```

**Attendu:**
```json
{
  "success": true,
  "paymentStatus": "paid",
  "amountTotal": 80000,
  "customerEmail": "..."
}
```

---

### Test 3: Récupérer depuis BD
```bash
curl -X GET \"http://localhost:8080/api/payments/session/cs_test_b1kbP9grbC95PKtgPXn66yAqIg2Nvk0qx4SMticHpxckhN36Sf4uV3lBmy\" \\
  -H \"Content-Type: application/json\" | jq .
```

**Attendu:**
```json
{
  "success": true,
  "payment": {
    "_id": "...",
    "status": "paid",
    "amount": 800,
    "sessionId": "cs_test_..."
  }
}
```

---

## 🌐 Tests en Navigateur

### Test 4: Page de Succès
```javascript
// Ouvrir Console (F12)

// Vérifier l'extraction du session_id
const params = new URLSearchParams(window.location.search);
console.log('Session ID:', params.get('session_id'));

// Vérifier localStorage
console.log('Reservation:', localStorage.getItem('currentReservation'));
console.log('Email:', localStorage.getItem('userEmail'));

// Vérifier la réaction API
// Attendre les logs dans la console
// 🔍 Vérification du paiement pour session: cs_test_...
// ✅ Infos Stripe complètes récupérées: {...}
```

---

### Test 5: Formulaire de Paiement
```javascript
// Console
const form = document.querySelector('form');
console.log('Form inputs:', form.querySelectorAll('input'));

// Vérifier localStorage après soumission
// Vérifier avant de payer:
console.log(localStorage.getItem('currentReservation')); // doit être null

// Vérifier pendant le paiement (avant redirection Stripe):
// Attendre et vérifier:
// localStorage.getItem('currentReservation') // doit être rempli
// localStorage.getItem('userEmail') // doit être rempli
```

---

## 🔍 Logs Importants à Vérifier

### Console (Frontend - F12)
```
✅ À chercher:
🔍 Vérification du paiement pour session: cs_test_...
✅ Infos Stripe complètes récupérées: {...}
💾 Données sauvegardées dans localStorage avec montant: 800
⚠️ Utilisation des données de fallback (si erreur)
```

### Terminal Backend
```bash
✅ À chercher:
💳 Traitement checkout.session.completed
🔍 GET_STRIPE_SESSION_DETAILS { sessionId: ... }
✅ Session retrieval successful
```

---

## 📋 Checklist Rapide

- [ ] Backend démarre sans erreur
- [ ] Frontend démarre sans erreur
- [ ] Accès à http://localhost:5173/payment sans erreur
- [ ] Accès à http://localhost:8080/api/health retourne 200
- [ ] Paiement test peut être fait
- [ ] Redirection vers /payment-success fonctionne
- [ ] Session ID visible sur la page
- [ ] Reçu peut être imprimé
- [ ] API endpoints répondent correctement

---

## 🔧 Dépannage Rapide

### \"Payment not found\"
```bash
# Vérifier si le paiement existe en BD
# 1. Ouvrir MongoDB Compass
# 2. Connexion: mongodb://localhost:27017
# 3. Base: hero-showcase-db
# 4. Collection: payments
# 5. Chercher: { \"sessionId\": \"cs_test_...\" }
```

### \"Session not found in Stripe\"
```bash
# Vérifier sur Stripe Dashboard
# 1. https://dashboard.stripe.com/test/payments
# 2. Chercher le session ID
# 3. Vérifier le statut (paid/unpaid)
# 4. Vérifier les métadonnées
```

### localStorage vide
```javascript
// Console
localStorage.setItem('currentReservation', JSON.stringify({
  title: 'Test', 
  total: 800,
  customerEmail: 'test@test.com'
}));
```

### API 404
```bash
# Vérifier les routes
curl http://localhost:8080/api/payments/stripe-session/test

# Doit retourner 200 OK (même si pas trouvé, 404 attendu)
# Vérifier que le endpoint existe en:
# backend/src/routes/payment.routes.ts
```

---

## 📊 Exemples de Données

### Session ID Test
```
cs_test_b1kbP9grbC95PKtgPXn66yAqIg2Nvk0qx4SMticHpxckhN36Sf4uV3lBmy
```

### Montant Test
```
800 euros = 80000 centimes
```

### Email Test
```
test@example.com
client@example.com
```

### Dates Test
```javascript
checkIn: \"2024-03-01T00:00:00.000Z\"
checkOut: \"2024-03-03T00:00:00.000Z\"
nights: 2
```

---

## 🎯 Flux Complet (5 min)

```bash
# 1. Démarrer (30 sec)
npm run dev  # frontend
npm run dev  # backend (autre terminal)

# 2. Ouvrir (10 sec)
# http://localhost:5173/payment

# 3. Remplir formulaire (30 sec)
# Prénom: Jean
# Nom: Dupont  
# Email: jean@example.com
# Cliquer: Payer maintenant

# 4. Paiement Stripe (1 min)
# Utiliser: 4242 4242 4242 4242
# Expiration: 12/25
# CVC: 123
# Cliquer: Pay

# 5. Vérifier succès (1 min)
# Vérifier URL contient session_id
# Vérifier badge \"PAYÉ\"
# Vérifier Session ID visible
# Cliquer: Imprimer le reçu
# Vérifier document complet
```

---

## 🔗 Liens Utiles

| Ressource | URL |
|-----------|-----|
| Stripe Dashboard | https://dashboard.stripe.com/test/payments |
| MongoDB Local | mongodb://localhost:27017 |
| Frontend Dev | http://localhost:5173 |
| Backend API | http://localhost:8080/api |
| Test Card | 4242 4242 4242 4242 |
| Doc Payment | [PAYMENT_INFO_CAPTURE.md](./PAYMENT_INFO_CAPTURE.md) |

---

## 💡 Tips

### Activer Logs Stripe Backend
```bash
# Dans backend/.env
STRIPE_LOG_LEVEL=debug
```

### Tester Webhook Localement
```bash
# Stripe CLI
stripe listen --forward-to localhost:8080/api/payments/webhook

# Note: Utilisé pour tester les webhooks en développement
```

### Vérifier Métadonnées
```javascript
// Dans Stripe Dashboard
// Payments → [Transaction] → Metadata tab
// Doit contenir: userId, apartmentId, nights, etc.
```

### Afficher localStorage
```javascript
// Console navigateur
Object.entries(localStorage).forEach(([k,v]) => {
  console.log(`${k}:`, JSON.parse(v));
});
```

---

## 🎬 Prochaines Étapes

- [ ] Tester avec données réelles
- [ ] Vérifier email de confirmation
- [ ] Configurer SMS de rappel
- [ ] Tester avec vrais montants
- [ ] Valider reçu PDF
- [ ] Tester fallbacks
- [ ] Configurer production Stripe

---

**Besoin d'aide?** Voir les autres fichiers:
- Technical: `PAYMENT_INFO_CAPTURE.md`
- URLs: `PAYMENT_URLS_GUIDE.md`  
- Tests: `PAYMENT_TESTING.md`
