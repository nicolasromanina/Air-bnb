# 🎯 Guide Complet d'Intégration - Système Amélioré d'Annulation

## Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Endpoints API](#endpoints-api)
4. [Exemples de Code](#exemples-de-code)
5. [Scénarios Réels](#scénarios-réels)
6. [Gestion d'Erreurs](#gestion-derreurs)
7. [Testes & Validation](#tests--validation)

---

## Vue d'ensemble

Le système amélioré distingue **5 types d'actions** sur les réservations:

| Action | Status | Timing | Remboursement |
|--------|--------|--------|----------------|
| **Cancellation** | cancelled | Avant check-in | Basé sur timing (0-100%) |
| **Early Checkout** | early_checkout | Après check-in | Proportionnel aux jours restants |
| **Modification** | confirmed | Avant check-in | Recalcul du prix |
| **Dispute** | dispute | Anytime | Manuel (révision équipe) |
| **Standard Checkout** | completed | À check-out | Aucun remboursement |

---

## Architecture

### Flux de Données

```
┌─────────────────────────────────────────────────────────────┐
│                   CLIENT REQUEST                            │
│         POST /api/reservations/:id/cancel                   │
│         { reason: "Plans changed" }                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│          RESERVATION CONTROLLER                             │
│   Valide les paramètres, extrait user du JWT               │
│   Appelle: reservationService.requestCancellation()         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│        RESERVATION SERVICE                                  │
│  1. Cherche la réservation par ID + userID                 │
│  2. Vérifie que guest n'est pas déjà checked-in             │
│  3. Calcule le % de remboursement basé sur timing          │
│  4. Crée/met à jour Payment avec refund status             │
│  5. Met à jour Reservation avec actionType + raison        │
│  6. Envoie email de confirmation                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│        DATA PERSISTENCE                                      │
│  - Reservation: { status, actionType, reason, refund }     │
│  - Payment: { status='refunded', refundReason }            │
│  - Email: Logs d'envoi                                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           EMAIL SERVICE                                      │
│  Envoie email de confirmation avec:                         │
│  - Détails de la réservation                               │
│  - Montant du remboursement                                │
│  - Raison de l'action                                      │
└─────────────────────────────────────────────────────────────┘
```

### Structure de Données

```typescript
// Réservation avant action
{
  _id: "abc123",
  status: "confirmed",
  checkIn: Date,
  checkOut: Date,
  totalPrice: 500,
  // ... autres champs
}

// Réservation après cancellation
{
  _id: "abc123",
  status: "cancelled",
  actionType: "cancellation",
  cancellationReason: "Plans changed",
  cancellationRequestedAt: Date,
  refundPercentage: 100,
  refundAmount: 500,
  // ... autres champs
}
```

---

## Endpoints API

### 1. Cancel Reservation (Avant Check-in)

```http
POST /api/reservations/:id/cancel
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Plans changed"
}
```

**Réponse (200):**
```json
{
  "success": true,
  "reservation": {
    "status": "cancelled",
    "actionType": "cancellation",
    "cancellationReason": "Plans changed",
    "cancellationRequestedAt": "2024-01-15T10:30:00Z",
    "refundPercentage": 100,
    "refundAmount": 500
  },
  "refund": {
    "percentage": 100,
    "amount": 500
  },
  "message": "Reservation cancelled successfully"
}
```

**Erreurs:**
```json
// ❌ Guest déjà checked-in
{
  "success": false,
  "error": "Cannot cancel: guest is already checked in. Please use early checkout endpoint instead. Endpoint: POST /api/reservations/:id/early-checkout"
}

// ❌ Annulation trop tard
{
  "success": false,
  "error": "Cannot cancel reservation less than 24 hours before check-in"
}

// ❌ Réservation introuvable
{
  "success": false,
  "error": "Reservation not found or cannot be cancelled"
}
```

---

### 2. Request Early Checkout (Après Check-in)

```http
POST /api/reservations/:id/early-checkout
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Family emergency"
}
```

**Réponse (200):**
```json
{
  "success": true,
  "reservation": {
    "status": "early_checkout",
    "actionType": "early_checkout",
    "actualCheckoutDate": "2024-01-16T10:00:00Z",
    "earlyCheckoutReason": "Family emergency",
    "refundPercentage": 45,
    "refundAmount": 225
  },
  "refund": {
    "percentage": 45,
    "amount": 225
  },
  "message": "Early checkout processed successfully"
}
```

---

### 3. Modify Reservation (Changer Dates)

```http
POST /api/reservations/:id/modify
Authorization: Bearer <token>
Content-Type: application/json

{
  "checkIn": "2024-02-01T15:00:00Z",
  "checkOut": "2024-02-05T11:00:00Z",
  "reason": "Extended stay by 2 days"
}
```

**Réponse (200):**
```json
{
  "success": true,
  "reservation": {
    "status": "confirmed",
    "actionType": "modification",
    "originalCheckOut": "2024-01-20T11:00:00Z",
    "modificationReason": "Extended stay by 2 days",
    "modifiedAt": "2024-01-15T10:30:00Z"
  },
  "message": "Reservation modified successfully"
}
```

---

### 4. Raise Dispute (Signaler un Problème)

```http
POST /api/reservations/:id/dispute
Authorization: Bearer <token>
Content-Type: application/json

{
  "disputeReason": "Apartment not as described in photos"
}
```

**Réponse (200):**
```json
{
  "success": true,
  "reservation": {
    "status": "dispute",
    "actionType": "dispute_resolution",
    "disputeReason": "Apartment not as described in photos"
  },
  "message": "Dispute raised successfully. Our team will review this shortly."
}
```

---

## Exemples de Code

### JavaScript/TypeScript - Frontend

```typescript
// 1. Annuler une réservation
async function cancelReservation(reservationId: string, reason: string) {
  try {
    const response = await fetch(
      `/api/reservations/${reservationId}/cancel`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Gestion d'erreur - afficher message spécifique
      if (data.error.includes('already checked in')) {
        alert('Cannot cancel - guest is checked in.\nUse early checkout instead.');
      } else {
        alert(`Error: ${data.error}`);
      }
      return;
    }

    // Succès - afficher le remboursement
    alert(
      `Reservation cancelled!\n` +
      `Refund: €${data.refund.amount} (${data.refund.percentage}%)`
    );
    
    // Recharger la liste des réservations
    location.reload();
  } catch (error) {
    console.error('Error:', error);
  }
}

// 2. Demander un départ anticipé
async function requestEarlyCheckout(
  reservationId: string,
  reason: string
) {
  const response = await fetch(
    `/api/reservations/${reservationId}/early-checkout`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reason })
    }
  );

  const data = await response.json();

  if (response.ok) {
    alert(
      `Early checkout confirmed!\n` +
      `Refund: €${data.refund.amount} for ${data.refund.percentage}% of remaining days`
    );
  } else {
    alert(`Error: ${data.error}`);
  }
}

// 3. Signaler un litige
async function raiseDispute(
  reservationId: string,
  disputeReason: string
) {
  const response = await fetch(
    `/api/reservations/${reservationId}/dispute`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ disputeReason })
    }
  );

  const data = await response.json();

  if (response.ok) {
    alert(
      `Dispute received!\n` +
      `Case #: ${reservationId}-DISPUTE\n` +
      `Our team will review within 24 hours.`
    );
  } else {
    alert(`Error: ${data.error}`);
  }
}
```

### cURL - Ligne de Commande

```bash
# 1. Annuler une réservation
curl -X POST http://localhost:3000/api/reservations/abc123/cancel \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Plans changed"
  }'

# 2. Départ anticipé
curl -X POST http://localhost:3000/api/reservations/abc123/early-checkout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Family emergency"
  }'

# 3. Modifier les dates
curl -X POST http://localhost:3000/api/reservations/abc123/modify \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "checkIn": "2024-02-01T15:00:00Z",
    "checkOut": "2024-02-10T11:00:00Z",
    "reason": "Extended stay"
  }'

# 4. Signaler un litige
curl -X POST http://localhost:3000/api/reservations/abc123/dispute \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "disputeReason": "Apartment not as described"
  }'
```

---

## Scénarios Réels

### Scénario 1: Annulation Standard (72h avant check-in)

```
Réservation: Studio Paris - 20-25 Jan 2024
Prix: €500
Action: Annulation 18 Jan (72h avant check-in)

┌─────────────────────────┐
│  TIMING CALCULATION     │
├─────────────────────────┤
│ Hours until check-in: 72h
│ Condition: ≥ 48h
│ Refund: 100%
└─────────────────────────┘

Résultat:
✅ Status: cancelled
✅ Remboursement: €500 (100%)
✅ Email envoyé au client
```

### Scénario 2: Annulation avec Pénalité (12h avant check-in)

```
Réservation: Apartment NYC - 20-25 Jan 2024
Prix: €800
Action: Annulation 19 Jan 12h (12h avant check-in)

┌─────────────────────────┐
│  TIMING CALCULATION     │
├─────────────────────────┤
│ Hours until check-in: 12h
│ Condition: < 24h
│ Refund: 0%
└─────────────────────────┘

Résultat:
✅ Status: cancelled
✅ Remboursement: €0 (frais de service non-remboursables)
✅ Email avec explication envoyé
```

### Scénario 3: Départ Anticipé (Early Checkout)

```
Réservation: House Berlin - 20-25 Jan 2024 (5 nuits)
Prix: €1000 (€200/nuit)
Action: Départ anticipé le 22 Jan (après 2 nuits)

┌──────────────────────────────────┐
│  EARLY CHECKOUT CALCULATION      │
├──────────────────────────────────┤
│ Check-in: 20 Jan
│ Check-out planifié: 25 Jan
│ Checkout réel: 22 Jan (3 jours utilisés)
│ Jours restants: 2 jours
│ Refund: (2 / 5) × 100% = 40%
│ Montant: €400
└──────────────────────────────────┘

Résultat:
✅ Status: early_checkout
✅ Remboursement: €400 (40% pour 2 jours non utilisés)
✅ Email avec détails envoyé
```

### Scénario 4: Impossible - Guest Already Checked In

```
Réservation: Apartment London - 20-25 Jan 2024
Status: confirmed (guest checked in on 20 Jan)
Action: Tentative d'annulation le 22 Jan

┌──────────────────────────────────┐
│  VALIDATION                      │
├──────────────────────────────────┤
│ Is guest checked in?
│ checkIn (20 Jan) ≤ now (22 Jan)? YES
│ checkOut (25 Jan) > now? YES
│ → Guest is checked in!
└──────────────────────────────────┘

Résultat:
❌ Error: "Cannot cancel: guest is already checked in."
❌ Suggestion: "Use early checkout instead."
```

---

## Gestion d'Erreurs

### Types d'Erreurs et Solutions

```typescript
// 1. Guest déjà arrivé
if (isCheckedIn(reservation)) {
  throw new Error(
    'Cannot cancel: guest is already checked in. ' +
    'Please use early checkout endpoint instead. ' +
    'Endpoint: POST /api/reservations/:id/early-checkout'
  );
}

// 2. Trop tard pour annuler
if (hoursUntilCheckIn < 24 && status === 'confirmed') {
  throw new Error(
    'Cannot cancel reservation less than 24 hours before check-in'
  );
}

// 3. Réservation introuvable
if (!reservation) {
  throw new Error('Reservation not found or cannot be cancelled');
}

// 4. Modification après check-in impossible
if (isCheckedIn(reservation) && newCheckOut < currentCheckOut) {
  throw new Error(
    'Cannot shorten stay for checked-in guest. ' +
    'Please use early checkout instead.'
  );
}
```

### Response Error Format

```json
{
  "success": false,
  "error": "Cannot cancel: guest is already checked in. Please use early checkout endpoint instead.",
  "code": "GUEST_CHECKED_IN",
  "statusCode": 400
}
```

---

## Tests & Validation

### Test Suite

```typescript
import { expect } from 'chai';
import request from 'supertest';
import app from '../app';

describe('Reservation Cancellation System', () => {
  
  // Test 1: Cancellation 72h before check-in
  it('should refund 100% when cancelled 72h before check-in', async () => {
    const res = await request(app)
      .post('/api/reservations/res1/cancel')
      .set('Authorization', `Bearer ${token}`)
      .send({ reason: 'Plans changed' });
    
    expect(res.status).to.equal(200);
    expect(res.body.refund.percentage).to.equal(100);
    expect(res.body.reservation.status).to.equal('cancelled');
  });

  // Test 2: Cancellation 12h before check-in (no refund)
  it('should not refund when cancelled <24h before check-in', async () => {
    const res = await request(app)
      .post('/api/reservations/res2/cancel')
      .set('Authorization', `Bearer ${token}`)
      .send({ reason: 'Urgent' });
    
    expect(res.status).to.equal(200);
    expect(res.body.refund.percentage).to.equal(0);
  });

  // Test 3: Cannot cancel if checked in
  it('should reject cancellation if guest is checked in', async () => {
    const res = await request(app)
      .post('/api/reservations/res3/cancel')
      .set('Authorization', `Bearer ${token}`)
      .send({ reason: 'Change mind' });
    
    expect(res.status).to.equal(400);
    expect(res.body.error).to.include('already checked in');
    expect(res.body.error).to.include('early-checkout');
  });

  // Test 4: Early checkout refund calculation
  it('should calculate early checkout refund correctly', async () => {
    const res = await request(app)
      .post('/api/reservations/res4/early-checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({ reason: 'Emergency' });
    
    expect(res.status).to.equal(200);
    expect(res.body.reservation.status).to.equal('early_checkout');
    expect(res.body.refund.percentage).to.be.greaterThan(0);
  });

  // Test 5: Raise dispute
  it('should raise dispute successfully', async () => {
    const res = await request(app)
      .post('/api/reservations/res5/dispute')
      .set('Authorization', `Bearer ${token}`)
      .send({ disputeReason: 'Apartment not as described' });
    
    expect(res.status).to.equal(200);
    expect(res.body.reservation.status).to.equal('dispute');
  });
});
```

### Manual Testing Checklist

- [ ] Cancel before 48h: Verify 100% refund
- [ ] Cancel 24-48h: Verify 50% refund
- [ ] Cancel <24h: Verify 0% refund
- [ ] Cancel after check-in: Verify error message
- [ ] Early checkout day 1: Verify ~80% refund
- [ ] Early checkout day 5 of 5: Verify 0% refund
- [ ] Modify dates: Verify status stays "confirmed"
- [ ] Raise dispute: Verify status becomes "dispute"
- [ ] Check email templates: Verify correct content
- [ ] Check payment records: Verify refund status

---

## 📊 Monitoring & Analytics

### Métriques à Tracker

```typescript
// Cancellation Rate
cancellations / total_reservations

// Refund Distribution
{
  "100%": 45,  // 45 cancellations with full refund
  "50%": 12,   // 12 cancellations with 50% refund
  "0%": 8      // 8 cancellations with no refund
}

// Early Checkout Rate
early_checkouts / confirmed_reservations

// Dispute Rate
disputes / total_reservations

// Average Refund %
(sum of all refund_percentages) / total_cancellations
```

---

**Version:** 1.0
**Last Updated:** 15 Janvier 2024
**Maintainer:** Development Team
