# 🔄 Système Amélioré d'Annulation de Réservation

## Vue d'ensemble

Le système d'annulation de réservation a été amélioré pour **distinguer les différents types d'actions** qui peuvent être prises sur une réservation, en fonction du moment où elles surviennent dans le cycle de vie du séjour.

### Philosophie Clé

> **"Une fois que le client est assis (checked in), on ne parle plus d'annulation, mais de terminaison anticipée, modification ou résolution de litige."**

---

## 📊 Cycle de Vie de Réservation

```
┌─────────────────────────────────────────────────────────────────┐
│                    RÉSERVATION CRÉÉE                            │
│                    status: 'pending'                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    ✓ CONFIRMATION
                    status: 'confirmed'
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   [AVANT CHECK-IN]   [À CHECK-IN]   [APRÈS CHECK-IN]
        │                  │                  │
   CANCELLATION      CHECK-IN         EARLY CHECKOUT
   (jusqu'à         (mise à jour      (si départ anticipé)
    check-in)       status)            
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                    ✓ CHECKOUT
                    status: 'completed'
                           │
                        [END]

ALTERNATIVES (Tout moment):
├─ Modification: Changer les dates
├─ Dispute: Signaler un problème
└─ Early Checkout: Partir plus tôt
```

---

## 🎯 Types d'Actions

### 1. **CANCELLATION** (Annulation - Avant Check-in)

**Quand:** Avant la date de check-in (avant que le client arrive)

**Status mis à jour:** `pending` ou `confirmed` → `cancelled`

**Raison:** Le client veut annuler la réservation avant d'arriver

**Remboursement:** Basé sur le timing:
- **≥48h avant check-in** : 100% remboursé
- **24-48h avant check-in** : 50% remboursé
- **<24h avant check-in** : 0% remboursé (frais de service)

**Endpoint:**
```
POST /api/reservations/:id/cancel
Content-Type: application/json

{
  "reason": "Plans changed (optionnel)"
}
```

**Réponse:**
```json
{
  "success": true,
  "reservation": {
    "status": "cancelled",
    "actionType": "cancellation",
    "cancellationReason": "Plans changed",
    "cancellationRequestedAt": "2024-01-15T10:30:00Z"
  },
  "refund": {
    "percentage": 100,
    "amount": 500
  }
}
```

---

### 2. **EARLY CHECKOUT** (Départ Anticipé - Pendant le Séjour)

**Quand:** Après le check-in, avant la date de check-out prévue

**Status mis à jour:** `confirmed` → `early_checkout`

**Raison:** Le client veut partir plus tôt que prévu

**Remboursement:** Proportionnel aux jours restants

```
Remboursement % = (jours restants / jours totaux) × 100
```

**Endpoint:**
```
POST /api/reservations/:id/early-checkout
Content-Type: application/json

{
  "reason": "Had to return home early (optionnel)"
}
```

**Réponse:**
```json
{
  "success": true,
  "reservation": {
    "status": "early_checkout",
    "actionType": "early_checkout",
    "actualCheckoutDate": "2024-01-16T10:00:00Z",
    "earlyCheckoutReason": "Had to return home early"
  },
  "refund": {
    "percentage": 45,
    "amount": 225
  }
}
```

---

### 3. **MODIFICATION** (Modification de Dates)

**Quand:** Avant le check-in (ou extension de séjour avant check-out)

**Status:** `confirmed` (inchangé)

**Raison:** Le client veut changer les dates de séjour

**Remboursement:** Calcul nouveau prix en fonction des nouvelles dates

**Endpoint:**
```
POST /api/reservations/:id/modify
Content-Type: application/json

{
  "checkIn": "2024-02-01T15:00:00Z",
  "checkOut": "2024-02-05T11:00:00Z",
  "reason": "Extended stay (optionnel)"
}
```

**Réponse:**
```json
{
  "success": true,
  "reservation": {
    "status": "confirmed",
    "actionType": "modification",
    "originalCheckOut": "2024-01-20T11:00:00Z",
    "modificationReason": "Extended stay",
    "modifiedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 4. **DISPUTE** (Résolution de Litige)

**Quand:** À tout moment (conflit ou problème)

**Status mis à jour:** quelconque → `dispute`

**Raison:** Le client signale un problème (appartement ne correspond pas, équipement cassé, etc.)

**Action Requise:** Examen manuel par l'équipe

**Endpoint:**
```
POST /api/reservations/:id/dispute
Content-Type: application/json

{
  "disputeReason": "Apartment conditions do not match listing"
}
```

**Réponse:**
```json
{
  "success": true,
  "reservation": {
    "status": "dispute",
    "actionType": "dispute_resolution",
    "disputeReason": "Apartment conditions do not match listing",
    "disputeResolvedAt": null
  },
  "message": "Dispute raised successfully. Our team will review this shortly."
}
```

---

## 🔒 Protection des Données

### Champs de Suivi

Chaque réservation enregistre maintenant:

```typescript
{
  // Type d'action
  actionType?: 'cancellation' | 'early_checkout' | 'modification' | 'dispute_resolution' | 'checkout';
  
  // Pour CANCELLATION
  cancellationReason?: string;
  cancellationRequestedAt?: Date;
  
  // Pour EARLY CHECKOUT
  actualCheckoutDate?: Date;
  earlyCheckoutReason?: string;
  
  // Pour MODIFICATION
  originalCheckOut?: Date;
  modificationReason?: string;
  modifiedAt?: Date;
  
  // Pour DISPUTE
  disputeReason?: string;
  disputeResolution?: string;
  disputeResolvedAt?: Date;
  
  // Remboursement (tous les types)
  refundAmount?: number;
  refundPercentage?: number;
  refundProcessedAt?: Date;
}
```

---

## 📋 Logique de Validation

### 1. Vérification du Status Actuel

```typescript
// Avant de permettre une action, on vérifie:
const reservation = await Reservation.findOne({
  _id: id,
  user: userId
});

// Si checked-in:
if (isCheckedIn(reservation)) {
  // ❌ CANCEL n'est pas autorisé
  // ✅ EARLY_CHECKOUT est autorisé
  // ❌ MODIFY n'est pas autorisé (sauf extension)
  // ✅ DISPUTE est autorisé
}
```

### 2. Calcul du Remboursement

```typescript
function calculateRefundPercentage(reservation) {
  const now = new Date();
  const checkIn = new Date(reservation.checkIn);
  const hoursUntilCheckIn = (checkIn - now) / (1000 * 60 * 60);
  
  // AVANT check-in
  if (hoursUntilCheckIn >= 48) return 100;
  if (hoursUntilCheckIn >= 24) return 50;
  if (hoursUntilCheckIn > 0) return 0;
  
  // APRÈS check-in (early checkout)
  const checkOut = new Date(reservation.checkOut);
  const daysRemaining = (checkOut - now) / (1000 * 60 * 60 * 24);
  const totalDays = (checkOut - checkIn) / (1000 * 60 * 60 * 24);
  
  return Math.max(0, Math.round((daysRemaining / totalDays) * 100));
}
```

---

## 🔌 Intégration avec Emails

### Emails Envoyés Automatiquement

| Action | Email | Destinataire |
|--------|-------|--------------|
| CANCELLATION | Confirmation d'annulation + détails de remboursement | Client + Propriétaire |
| EARLY_CHECKOUT | Confirmation de départ anticipé | Client + Propriétaire |
| MODIFICATION | Confirmation de modification | Client + Propriétaire |
| DISPUTE | Avis d'escalade + support | Client + Équipe Support |

**Exemple de template (Early Checkout):**
```
Sujet: Early Checkout - Reservation #12345

Bonjour,

Nous avons enregistré votre départ anticipé pour la réservation #12345.

Détails:
- Appartement: Studio Deluxe - Paris
- Départ prévu: 20 Jan 2024
- Départ réel: 16 Jan 2024
- Remboursement: 45% (€225 sur €500)

Votre remboursement sera traité sous 5-7 jours.

Merci d'avoir choisi notre service!
```

---

## 📱 Exemple d'Utilisation Client

### Scénario 1: Annulation Avant Arrivée

```bash
# 72h avant check-in
curl -X POST http://api/reservations/abc123/cancel \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Plans changed"}'

# ✅ Résultat: 100% remboursé (€500)
```

### Scénario 2: Départ Anticipé

```bash
# Après check-in, le 3e jour sur 5
curl -X POST http://api/reservations/abc123/early-checkout \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Family emergency"}'

# ✅ Résultat: 40% remboursé (€200 pour 2 jours restants)
```

### Scénario 3: Signaler un Litige

```bash
curl -X POST http://api/reservations/abc123/dispute \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{"disputeReason": "Apartment not as described in photos"}'

# ✅ Résultat: Marqué en dispute, équipe revoit le cas
```

---

## ✅ Checklist de Déploiement

- [ ] Mise à jour de `Reservation.ts` (modèle) ✅
- [ ] Mise à jour de `reservation.service.ts` (logique) ✅
- [ ] Mise à jour de `reservation.controller.ts` (endpoints) ✅
- [ ] Mise à jour des routes (`reservation.routes.ts`) ✅
- [ ] Ajouter templates d'emails (early checkout, dispute)
- [ ] Mettre à jour la documentation API
- [ ] Tester tous les scénarios
- [ ] Déployer en production avec rollback plan

---

## 🧪 Tests Recommandés

### Test 1: Annulation 72h avant check-in
```typescript
const res = await POST('/api/reservations/123/cancel', {
  reason: 'Plans changed'
});
assert(res.refund.percentage === 100);
```

### Test 2: Annulation 12h avant check-in
```typescript
const res = await POST('/api/reservations/124/cancel', {
  reason: 'Too expensive'
});
assert(res.refund.percentage === 0);
```

### Test 3: Early Checkout
```typescript
const res = await POST('/api/reservations/125/early-checkout', {
  reason: 'Family emergency'
});
assert(res.reservation.status === 'early_checkout');
```

### Test 4: Impossible d'annuler si checked-in
```typescript
const res = await POST('/api/reservations/126/cancel', {
  reason: 'Change of plans'
});
assert(res.error.includes('guest is already checked in'));
assert(res.error.includes('early-checkout'));
```

---

## 📞 Support & Escalade

### Qui Contacte Qui?

| Scénario | Client | Propriétaire | Support |
|----------|--------|--------------|---------|
| Cancellation | ✅ Confirm + Refund | ✅ Alert | |
| Early Checkout | ✅ Confirm | ✅ Alert | |
| Modification | ✅ Confirm | ✅ Alert | |
| Dispute | ✅ Ticket créé | ✅ Alert | ✅ Revue manuelle |

---

## 📚 Documentation Associée

- [Guide d'Intégration d'Email](./GUIDE_INTEGRATION.md)
- [API Documentation](./README_DOCUMENTATION.md)
- [Guide de Déploiement](./PRODUCTION_DEPLOYMENT_GUIDE.md)

---

**Version:** 1.0
**Date:** 15 Janvier 2024
**Responsable:** Development Team
