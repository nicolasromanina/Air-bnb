# 🎯 Guide des URLs de Paiement

## URLs Principales

### 1. **Page de Paiement (Formulaire)**
```
http://localhost:8080/payment
```
- Affiche le **formulaire de paiement**
- Recap complète de la réservation
- Montant à payer
- Bouton de redirection vers Stripe

---

## 2. **Redirection Stripe (URL de Checkout)**
```
https://checkout.stripe.com/c/pay/cs_test_b1kbP9grbC95PKtgPXn66yAqIg2Nvk0qx4SMticHpxckhN36Sf4uV3lBmy#fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdkdWxOYHwnPyd1blpxYHZxWjA0VnRuV2ZUS2t2VGl2YGxGcUI0dEJMQGtITFEyfV9PaDJjaDdpYnJ2XHZpTmRNUUo8ckQ3Vzc3NF9Na059djBNM1ZMX1YxQnVrbENnf1UxMjE1SGF3c251NTVfPFZ%2FMXBQXScpJ2N3amhWYHdzYHcnP3F3cGApJ2dkZm5id2pwa2FGamlqdyc%2FJyZjY2NjY2MnKSdpZHxqcHFRfHVgJz8naHBpcWxabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl
```
- Page de **paiement sécurisée Stripe**
- Saisie des données bancaires
- Vérification 3D Secure
- État: **EN COURS DE PAIEMENT**

---

## 3. **Succès du Paiement** ✅
```
http://localhost:8080/payment-success?session_id=cs_test_b1kbP9grbC95PKtgPXn66yAqIg2Nvk0qx4SMticHpxckhN36Sf4uV3lBmy
```

### ✅ Statut: PAIEMENT RÉUSSI

### Informations Affichées:
```
📋 DÉTAILS DE LA RÉSERVATION
  • Statut: ✓ PAYÉ
  • Montant payé: 800€
  • Devise: EUR
  • Email de confirmation: client@example.com
  • Logement: [Titre de l'appartement]
  • Check-in: [Date]
  • Check-out: [Date]
  • Durée: [Nuits] nuit(s)
  • Personnes: [Nombre]
  • Chambres: [Nombre]
  • Options sélectionnées: [Liste avec prix]
  
🔐 RÉFÉRENCES DE PAIEMENT
  • Session ID Stripe: cs_test_b1kbP9grbC95PKtgPXn66yAqIg2Nvk0qx4SMticHpxckhN36Sf4uV3lBmy
  • ID Paiement local: [ID MongoDB]
  • Vérification: ✓ [Date]
```

### Actions Disponibles:
1. **Imprimer le reçu** - Génère un PDF complet
2. **Retour à l'accueil** - Page d'accueil
3. **Mes réservations** - Liste des réservations

---

## 📄 Reçu Imprimable

### Contenu du Reçu:
```
┌─────────────────────────────────┐
│      REÇU DE PAIEMENT           │
│   [Logo de l'application]       │
└─────────────────────────────────┘

📋 DÉTAILS DU PAIEMENT
  Statut: ✓ PAYÉ
  Montant payé: 800,00€
  Devise: EUR
  Date: [Date du paiement]
  Méthode: 💳 Carte bancaire

👤 INFORMATIONS CLIENT
  Nom: [Nom complet]
  Email: [Email]

🏠 DÉTAILS DE LA RÉSERVATION
  Logement: [Titre]
  Numéro: [Numéro]
  Check-in: [Date]
  Check-out: [Date]
  Durée: [Nuits] nuit(s)
  Personnes: [Nombre]
  Chambres: [Nombre]

💰 RÉCAPITULATIF DES COÛTS
  Coût du logement: [Prix]€
  Options supplémentaires: [Prix]€
  ─────────────────────────
  MONTANT TOTAL PAYÉ: 800,00€

🔐 RÉFÉRENCES DE PAIEMENT
  Session ID Stripe: cs_test_b1kbP...
  ID Paiement: [MongoDB ID]

Merci pour votre réservation !
```

---

## 🔄 Flux Complet

```
┌─────────────────────────────────────────┐
│  1. PAGE DE PAIEMENT /payment            │
│     • Saisie formulaire                  │
│     • Vérification données               │
│     • Click "Payer maintenant"           │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  2. REDIRECTION STRIPE                  │
│     https://checkout.stripe.com/c/pay/  │
│     • Saisie carte bancaire              │
│     • Vérification 3D Secure             │
│     • Traitement du paiement             │
└────────────────┬────────────────────────┘
                 │
       ┌─────────┴─────────┐
       │                   │
       ▼                   ▼
    ✅ SUCCÈS            ❌ ERREUR
       │                   │
       ▼                   ▼
  /payment-success    /payment?error
  (avec session_id)   (avec message)
```

---

## 🛠️ Données Transmises

### De `/payment` à Stripe:
```javascript
{
  "amount": 800,                    // Montant en euros
  "currency": "eur",                // Devise
  "apartmentId": 1,                 // ID de l'appartement
  "apartmentNumber": "Apt 101",     // Numéro
  "title": "Charmant studio",       // Titre de l'annonce
  "checkIn": "2024-02-15T...",      // Date arrivée
  "checkOut": "2024-02-17T...",     // Date départ
  "nights": 2,                      // Nombre de nuits
  "guests": 2,                      // Nombre de personnes
  "bedrooms": 1,                    // Nombre de chambres
  "customerEmail": "...",           // Email client
  "customerName": "...",            // Nom client
  "selectedOptions": [              // Options sélectionnées
    {
      "name": "WiFi premium",
      "price": 20,
      "quantity": 1
    }
  ]
}
```

### De Stripe à `/payment-success`:
```javascript
{
  "session_id": "cs_test_b1kbP...",  // ID de session Stripe
  // Autres paramètres (optionnels)
}
```

### Données Récupérées côté Success:
```javascript
{
  "sessionId": "cs_test_...",
  "paymentStatus": "paid",
  "amountTotal": 80000,              // En centimes
  "currency": "eur",
  "customerEmail": "client@example.com",
  "customerName": "Jean Dupont",
  "paymentMethod": "card",
  "reservationDetails": { ... },
  "verifiedAt": "2024-02-15T..."
}
```

---

## 🔗 Endpoints API

### Récupérer infos Stripe complètes:
```bash
GET /api/payments/stripe-session/cs_test_b1kbP...

Réponse:
{
  "success": true,
  "session": { ... },    // Données Stripe complètes
  "payment": { ... }     // Données locales
}
```

### Vérifier le paiement:
```bash
POST /api/payments/verify
Body: { "sessionId": "cs_test_..." }

Réponse:
{
  "success": true,
  "paymentStatus": "paid",
  "amountTotal": 80000,
  "currency": "eur",
  ...
}
```

### Récupérer paiement depuis BD:
```bash
GET /api/payments/session/cs_test_b1kbP...

Réponse:
{
  "success": true,
  "payment": { ... }
}
```

---

## 💡 Points Clés

✅ **Session ID** conservé et affiché dans le reçu
✅ **Informations Stripe** récupérées de 3 sources différentes
✅ **Reçu complet** avec tous les détails
✅ **Résilience** en cas d'erreur
✅ **Traçabilité** complète du paiement

---

## 🎯 Résumé

| URL | Étape | Description |
|-----|-------|-------------|
| `/payment` | 1️⃣ Formulaire | Saisie et confirmation |
| `stripe.com/c/pay/...` | 2️⃣ Paiement | Transaction sécurisée |
| `/payment-success?session_id=...` | 3️⃣ Confirmation | Affichage du reçu |

