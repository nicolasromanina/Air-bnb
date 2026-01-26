# Capture Complète des Informations de Paiement Stripe

## 📋 Vue d'ensemble

Le système a été amélioré pour capturer et afficher **toutes les informations complètes** de paiement Stripe, y compris :
- Session ID Stripe
- Statut du paiement
- Montant et devise
- Informations client
- Détails de la réservation
- Méthode de paiement
- Métadonnées Stripe

## 🔄 Flux de Paiement

### 1. **PaymentForm.tsx** - Création du paiement
```typescript
// Avant redirection, toutes les données sont sauvegardées localement:
localStorage.setItem('currentReservation', JSON.stringify(completeReservationData));
localStorage.setItem('userEmail', data.email);
localStorage.setItem('userName', `${data.firstName} ${data.lastName}`);
```

**Données sauvegardées:**
- ✅ informations de réservation complètes
- ✅ dates (checkIn, checkOut)
- ✅ nombre de personnes et chambres
- ✅ prix (basePrice, optionsPrice, total)
- ✅ options sélectionnées
- ✅ informations client

### 2. **PaymentSuccess.tsx** - Vérification et affichage

#### Hiérarchie de récupération des données:

```
1. api.verifyPayment(sessionId)         ← Vérifier auprès de Stripe
      ↓
2. api.getStripeSessionDetails(sessionId) ← Récupérer infos Stripe complètes
      ↓
3. api.getPaymentBySessionId(sessionId)  ← Récupérer depuis notre BD
      ↓
4. localStorage.getItem('currentReservation') ← Fallback local
```

## 🛠️ Nouveaux Endpoints Backend

### 1. **GET /payments/stripe-session/:sessionId** (Nouveau)
Récupère les informations **complètes** d'une session Stripe.

**Réponse:**
```json
{
  "success": true,
  "session": {
    "id": "cs_test_...",
    "status": "paid",
    "amount_total": 80000,
    "currency": "eur",
    "customer_email": "client@example.com",
    "customer_details": { ... },
    "payment_intent": { ... },
    "payment_method_types": ["card"],
    "created": 1234567890,
    "expires_at": 1234567890,
    "metadata": { ... },
    "line_items": { ... }
  },
  "payment": {
    "_id": "...",
    "status": "paid",
    "amount": 800,
    "currency": "eur",
    "userEmail": "client@example.com",
    "user": { ... },
    "reservation": { ... },
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### 2. **POST /payments/verify** (Existant - Amélioré)
Vérifie le paiement auprès de Stripe et retourne les infos enrichies.

### 3. **GET /payments/session/:sessionId** (Existant - Amélioré)
Récupère le paiement depuis la base de données locale.

## 📊 Informations Affichées dans PaymentSuccess

### Section Principale
- ✅ Statut du paiement (Confirmé/En attente)
- ✅ Montant total payé avec devise
- ✅ Email de confirmation
- ✅ Dates de réservation (check-in, check-out)
- ✅ Détails du logement (titre, numéro)
- ✅ Nombre de personnes et chambres
- ✅ Options sélectionnées avec prix
- ✅ Références Stripe (Session ID + ID local)

### Reçu Imprimable
Document complet incluant:
1. **Détails du paiement**
   - Statut (badge avec couleur)
   - Montant payé
   - Devise
   - Date du paiement
   - Méthode de paiement

2. **Informations client**
   - Nom complet
   - Email

3. **Détails de la réservation**
   - Logement
   - Numéro d'appartement
   - Dates de séjour
   - Durée
   - Nombre de personnes

4. **Récapitulatif des coûts**
   - Coût du logement
   - Options supplémentaires
   - Montant total payé

5. **Références de paiement**
   - Session ID Stripe (complète)
   - ID de paiement local

## 💾 Sauvegarde des Données

### localStorage (Avant redirection Stripe)
```javascript
{
  currentReservation: {
    title, apartmentNumber, image,
    checkIn, checkOut, nights,
    guests, bedrooms,
    basePrice, optionsPrice, total,
    selectedOptions: [],
    customerEmail, customerName
  },
  userEmail: "...",
  userName: "..."
}
```

### Base de Données (Après paiement)
- Paiement: `status`, `amount`, `currency`, `userEmail`, `metadata`, `sessionId`, `paymentIntentId`
- Réservation: `status: 'confirmed'`, `payment: paymentId`

## 🔐 Sécurité

- ✅ Données sensibles pas exposées en URL
- ✅ Session ID conservé de manière sécurisée
- ✅ Vérification côté serveur avant affichage
- ✅ Métadonnées encodées dans Stripe

## 📱 Résilience

Le système fonctionne même si:
- Stripe est temporairement indisponible → fallback BD
- BD est indisponible → fallback localStorage
- Toutes les sources échouent → affichage avec session ID visible

## 🎯 URLs de Paiement

Après paiement réussi:
```
http://localhost:8080/payment-success?session_id=cs_test_b1kbP9grbC95PKtgPXn66yAqIg2Nvk0qx4SMticHpxckhN36Sf4uV3lBmy
```

Le session ID est extrait et utilisé pour récupérer toutes les informations complètes.

## 🧪 Vérification

Pour tester la récupération d'infos:

```bash
# Frontend
curl http://localhost:5173/payment-success?session_id=cs_test_...

# API Stripe complète
curl http://localhost:8080/api/payments/stripe-session/cs_test_...

# Infos locales
curl http://localhost:8080/api/payments/session/cs_test_...
```

## 📝 Logs de Débogage

Le système enregistre chaque étape:
```
🔍 Vérification du paiement pour session: cs_test_...
✅ Infos Stripe complètes récupérées: {...}
✅ Paiement vérifié depuis Stripe: {...}
💾 Données sauvegardées dans localStorage avec montant: 800
```
