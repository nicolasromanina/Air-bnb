# 🧪 Tests de Vérification du Paiement

## Vérifications à Effectuer

### ✅ Avant de Payer

1. **Vérifier localStorage vide**
   ```javascript
   localStorage.getItem('currentReservation') // null
   localStorage.getItem('userEmail')          // null
   localStorage.getItem('userName')           // null
   ```

2. **Vérifier formulaire de paiement**
   - Montant correct affiché
   - Détails de réservation complets
   - Options sélectionnées visibles
   - Coûts bien répartis (base + options)

---

### ✅ Pendant le Paiement (Redirection Stripe)

1. **Vérifier localStorage rempli**
   ```javascript
   // Après click "Payer"
   const reservation = JSON.parse(localStorage.getItem('currentReservation'));
   console.log(reservation.total);        // Doit être correct
   console.log(reservation.customerEmail);
   console.log(reservation.selectedOptions);
   ```

2. **Vérifier URL Stripe**
   - URL commençant par `https://checkout.stripe.com/c/pay/`
   - Session ID visible dans l'URL
   - Montant correct sur la page Stripe

3. **Vérifier métadonnées transmises à Stripe**
   ```javascript
   // Dans Stripe Dashboard -> Payments -> [Session]
   // Vérifier: sessionId, amount, currency, metadata
   ```

---

### ✅ Après le Paiement - Vérifier Success Page

#### 1. URL Correcte
```
http://localhost:8080/payment-success?session_id=cs_test_...
```

#### 2. Session ID Extrait
```javascript
// En console:
const params = new URLSearchParams(window.location.search);
params.get('session_id') // Doit retourner "cs_test_..."
```

#### 3. Logs de Débogage (Console)
```
🔍 Vérification du paiement pour session: cs_test_...
✅ Infos Stripe complètes récupérées: {...}
// ou
✅ Paiement récupéré depuis la BD: {...}
```

#### 4. Affichage de la Confirmation
- ✅ Badge "PAYÉ" avec checkmark vert
- ✅ Montant total affiché correctement
- ✅ Toutes les informations visibles

---

## Tests API Curl

### Test 1: Récupérer Session Stripe Complète
```bash
curl -X GET "http://localhost:8080/api/payments/stripe-session/cs_test_b1kbP9grbC95PKtgPXn66yAqIg2Nvk0qx4SMticHpxckhN36Sf4uV3lBmy" \
  -H "Content-Type: application/json"
```

**Vérifier dans la réponse:**
- ✅ `success: true`
- ✅ `session.status: "paid"`
- ✅ `session.amount_total: 80000`
- ✅ `session.currency: "eur"`
- ✅ `session.customer_email: "..."`
- ✅ `session.metadata: { ... }`
- ✅ `payment: { ... }`

### Test 2: Vérifier le Paiement
```bash
curl -X POST "http://localhost:8080/api/payments/verify" \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"cs_test_b1kbP9grbC95PKtgPXn66yAqIg2Nvk0qx4SMticHpxckhN36Sf4uV3lBmy"}'
```

**Vérifier dans la réponse:**
- ✅ `success: true`
- ✅ `paymentStatus: "paid"`
- ✅ `amountTotal: 80000`
- ✅ `metadata: { ... }`

### Test 3: Récupérer Paiement depuis BD
```bash
curl -X GET "http://localhost:8080/api/payments/session/cs_test_b1kbP9grbC95PKtgPXn66yAqIg2Nvk0qx4SMticHpxckhN36Sf4uV3lBmy" \
  -H "Content-Type: application/json"
```

**Vérifier dans la réponse:**
- ✅ `success: true`
- ✅ `payment._id: "..."`
- ✅ `payment.status: "paid"`
- ✅ `payment.amount: 800` (euros, pas centimes)
- ✅ `payment.reservation: {...}`

---

## Tests Manuels dans le Navigateur

### 1. Ouvrir Developer Tools (F12)
```
Network tab → filtrer par "payment"
Console tab → vérifier les logs
```

### 2. Tester le Formulaire de Paiement

**Remplir le formulaire:**
- [ ] Prénom: "Jean"
- [ ] Nom: "Dupont"
- [ ] Email: "jean@example.com"

**Click "Payer maintenant":**
```javascript
// Vérifier dans localStorage:
localStorage.getItem('userEmail')   // "jean@example.com"
localStorage.getItem('userName')    // "Jean Dupont"
```

### 3. Tester la Page de Succès

**Données visibles:**
```
✓ Logo présent
✓ Badge "PAIEMENT RÉUSSI"
✓ Montant correct: 800€
✓ Email de confirmation
✓ Dates de réservation
✓ Options affichées
✓ Session ID visible dans les références
```

**Tester le reçu:**
- Click "Imprimer le reçu"
- Vérifier que la window print s'ouvre
- Vérifier que toutes les infos sont présentes
- Contient le Session ID complet

---

## Vérifications des Métadonnées

### Dans Stripe Dashboard

1. Aller sur https://dashboard.stripe.com/test/payments
2. Sélectionner le dernier paiement
3. Cliquer sur "View details"
4. Vérifier l'onglet "Metadata":

```json
{
  "userId": "...",
  "reservationId": "...",
  "apartmentId": "1",
  "apartmentNumber": "Apt 101",
  "nights": "2",
  "guests": "2"
}
```

### Données de Réservation dans Metadata

```javascript
// Dans la réponse API:
response.data.session.metadata.reservationDetails // Doit contenir les détails
response.data.session.line_items                  // Doit contenir le produit avec prix
```

---

## Checklist Complète

### ✅ Phase 1: Avant Paiement
- [ ] Form de paiement s'affiche
- [ ] Montant correct (base + options)
- [ ] Récap complète visible
- [ ] Email pré-rempli si authentifié
- [ ] localStorage vide au départ

### ✅ Phase 2: Lors du Paiement
- [ ] Redirection vers Stripe
- [ ] localStorage rempli avant redirection
- [ ] Session ID visible dans localStorage
- [ ] Montant sur Stripe = montant local

### ✅ Phase 3: Après Paiement
- [ ] Redirection vers /payment-success?session_id=...
- [ ] Session ID extrait de l'URL
- [ ] Badge "PAYÉ" affiché
- [ ] Tous les détails affichés
- [ ] localStorage pas nettoyé (gardé pour fallback)
- [ ] Reçu générable et complet
- [ ] Session ID dans le reçu
- [ ] Console logs sans erreurs

### ✅ Phase 4: Endpoints API
- [ ] GET /api/payments/stripe-session/:sessionId → 200 OK
- [ ] POST /api/payments/verify → 200 OK
- [ ] GET /api/payments/session/:sessionId → 200 OK
- [ ] Réponses contiennent les bonnes données

### ✅ Phase 5: Résilience
- [ ] Si Stripe indisponible → fallback BD
- [ ] Si BD indisponible → fallback localStorage
- [ ] Errors gérés avec messages clairs
- [ ] Page reste fonctionnelle même avec erreur

---

## Exemples de Réponses

### Success
```json
{
  "success": true,
  "paymentStatus": "paid",
  "amountTotal": 80000,
  "currency": "eur",
  "customerEmail": "client@example.com",
  "customerName": "Jean Dupont",
  "sessionId": "cs_test_b1kbP9grbC95PKtgPXn66yAqIg2Nvk0qx4SMticHpxckhN36Sf4uV3lBmy",
  "paymentId": "507f1f77bcf86cd799439011",
  "reservationId": "507f1f77bcf86cd799439012",
  "verifiedAt": "2024-02-15T10:30:00.000Z"
}
```

### Error Fallback
```json
{
  "success": true,
  "paymentStatus": "pending_verification",
  "amountTotal": 80000,
  "currency": "eur",
  "customerEmail": "client@example.com",
  "sessionId": "cs_test_b1kbP9grbC95PKtgPXn66yAqIg2Nvk0qx4SMticHpxckhN36Sf4uV3lBmy",
  "verifiedAt": "2024-02-15T10:30:00.000Z"
}
```

---

## Commandes de Test Utiles

### Vérifier les logs backend
```bash
# Terminal backend
npm run dev
# Chercher les logs 🔍, ✅, ❌
```

### Vérifier la BD
```bash
# MongoDB compass ou CLI
db.payments.findOne({"sessionId": "cs_test_..."})
# Vérifier: status, amount, metadata
```

### Tester en mode développement
```javascript
// Console navigateur
// Forcer la récupération d'infos
await api.getStripeSessionDetails('cs_test_b1kbP...');
```

---

## 📊 Rapport de Test

| Aspect | ✅ Réussi | ⚠️ Attention | Commentaires |
|--------|----------|-------------|-------------|
| Formulaire | | | |
| localStorage | | | |
| Redirection Stripe | | | |
| Session ID | | | |
| Vérification | | | |
| Affichage | | | |
| Reçu | | | |
| API | | | |
| Résilience | | | |

