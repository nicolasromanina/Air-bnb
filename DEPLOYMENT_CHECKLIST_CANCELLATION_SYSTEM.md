# ✅ Checklist de Déploiement - Système Amélioré d'Annulation

## Phase 1: Vérification du Code (Environnement Local)

### 1.1 TypeScript Compilation
- [ ] Vérifier qu'il y a **0 erreurs TypeScript** dans le projet
```bash
npm run build  # ou tsc --noEmit
```

### 1.2 Fichiers Modifiés - Vérification
- [ ] **backend/src/models/Reservation.ts**
  - [x] IReservation interface étendue avec 7 statuses
  - [x] New fields: actionType, cancellationReason, etc.
  - [x] MongoDB schema mis à jour avec 9 nouveaux champs
  
- [ ] **backend/src/services/reservation.service.ts**
  - [x] Nouvelle méthode: `isCheckedIn()`
  - [x] Nouvelle méthode: `calculateRefundPercentage()`
  - [x] Nouvelle méthode: `requestCancellation()`
  - [x] Nouvelle méthode: `processEarlyCheckout()`
  - [x] Nouvelle méthode: `modifyReservation()`
  - [x] Nouvelle méthode: `raiseDispute()`
  - [x] Ancienne méthode: `cancelReservation()` refactorisée pour dispatcher

- [ ] **backend/src/controllers/reservation.controller.ts**
  - [x] Endpoint `POST /cancel` mis à jour
  - [x] Nouveau endpoint: `POST /early-checkout`
  - [x] Nouveau endpoint: `POST /modify`
  - [x] Nouveau endpoint: `POST /dispute`

- [ ] **backend/src/routes/reservation.routes.ts**
  - [x] Route `POST /:id/cancel` ajoutée (POST, pas DELETE)
  - [x] Route `POST /:id/early-checkout` ajoutée
  - [x] Route `POST /:id/modify` ajoutée
  - [x] Route `POST /:id/dispute` ajoutée
  - [x] Legacy `DELETE /:id/cancel` préservée pour compatibilité

- [ ] **backend/src/services/email.service.ts**
  - [x] Nouvelle méthode: `sendCancellationConfirmationEmail()`
  - [x] Nouvelle méthode: `sendEarlyCheckoutEmail()`
  - [x] Nouvelle méthode: `sendDisputeNotificationEmail()`

### 1.3 Dépendances
- [ ] Vérifier que **nodemailer** est installé
```bash
npm ls nodemailer  # dans le répertoire backend
```
- [ ] Vérifier que **mongoose** supporte tous les types de champs
```bash
npm ls mongoose
```

---

## Phase 2: Configuration Environnement

### 2.1 Variables d'Environnement (.env)

Vérifier que les variables suivantes sont configurées:

```bash
# Email Configuration
SMTP_HOST=<votre_smtp_host>
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<votre_email>
SMTP_PASS=<votre_mot_de_passe>

# Contact Information
CONTACT_EMAIL=support@example.com
CONTACT_PHONE=+33 00 00 000
COMPANY_NAME=YourCompanyName

# Admin Email (pour notifications)
ADMIN_EMAIL=admin@example.com
```

- [ ] Tester la connexion SMTP
```bash
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
transporter.verify((error, success) => {
  if (error) console.error('SMTP Error:', error);
  else console.log('✅ SMTP Connection OK');
});
"
```

### 2.2 MongoDB Connection
- [ ] Vérifier que MongoDB est accessible
- [ ] Vérifier que les migrations de schéma sont appliquées

---

## Phase 3: Tests Unitaires

### 3.1 Tests Service Layer

```bash
npm test -- backend/src/services/reservation.service.test.ts
```

Test Cases à Vérifier:

- [ ] `isCheckedIn()` returns true when guest is between check-in and check-out
- [ ] `isCheckedIn()` returns false when guest hasn't checked in yet
- [ ] `calculateRefundPercentage()` returns 100 for >48h before check-in
- [ ] `calculateRefundPercentage()` returns 50 for 24-48h before check-in
- [ ] `calculateRefundPercentage()` returns 0 for <24h before check-in
- [ ] `calculateRefundPercentage()` returns proportional for early checkout
- [ ] `requestCancellation()` succeeds for pending reservation
- [ ] `requestCancellation()` succeeds for confirmed (before check-in)
- [ ] `requestCancellation()` fails if guest is checked in
- [ ] `processEarlyCheckout()` succeeds if guest is checked in
- [ ] `processEarlyCheckout()` fails if guest not checked in yet
- [ ] `modifyReservation()` updates dates correctly
- [ ] `raiseDispute()` sets status to 'dispute'

### 3.2 Tests Controller Layer

```bash
npm test -- backend/src/controllers/reservation.controller.test.ts
```

- [ ] POST /cancel returns 200 with refund details
- [ ] POST /early-checkout returns 200 with refund details
- [ ] POST /modify returns 200 with updated reservation
- [ ] POST /dispute returns 200 with dispute ticket
- [ ] Cancellation error messages include helpful suggestions
- [ ] Early checkout available when guest is checked in

### 3.3 Tests Integration

```bash
npm test -- backend/tests/integration/reservation.integration.test.ts
```

- [ ] Full cancellation flow: create → confirm → cancel → email sent
- [ ] Early checkout flow: create → confirm → check in → early checkout
- [ ] Payment refund flow: reservation → payment marked refunded
- [ ] Email notifications sent for each action type

---

## Phase 4: Tests Manuels

### 4.1 Test 1: Cancellation 72h Before Check-in

```bash
curl -X POST http://localhost:3000/api/reservations/TEST_RES_001/cancel \
  -H "Authorization: Bearer TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Test cancellation 72h before"}'
```

Vérifier:
- [ ] Response status: 200
- [ ] Response.reservation.status: 'cancelled'
- [ ] Response.reservation.actionType: 'cancellation'
- [ ] Response.refund.percentage: 100
- [ ] Email reçu par le client
- [ ] Payment status en base de données: 'refunded'

### 4.2 Test 2: Cancellation 12h Before Check-in

```bash
curl -X POST http://localhost:3000/api/reservations/TEST_RES_002/cancel \
  -H "Authorization: Bearer TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Last minute cancellation"}'
```

Vérifier:
- [ ] Response status: 200
- [ ] Response.reservation.status: 'cancelled'
- [ ] Response.refund.percentage: 0
- [ ] Email mentionnant "non-refundable" reçu

### 4.3 Test 3: Early Checkout

```bash
# 1. Créer une réservation et confirmer check-in manually en base
# (ou passer checkIn en date passée)

# 2. Demander early checkout
curl -X POST http://localhost:3000/api/reservations/TEST_RES_003/early-checkout \
  -H "Authorization: Bearer TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Family emergency"}'
```

Vérifier:
- [ ] Response status: 200
- [ ] Response.reservation.status: 'early_checkout'
- [ ] Response.refund.percentage: > 0 (proportional)
- [ ] Email de départ anticipé reçu

### 4.4 Test 4: Cannot Cancel if Checked In

```bash
# Créer réservation avec check-in en date passée
# Puis:
curl -X POST http://localhost:3000/api/reservations/TEST_RES_004/cancel \
  -H "Authorization: Bearer TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Change of plans"}'
```

Vérifier:
- [ ] Response status: 400
- [ ] Response.error: inclut "already checked in"
- [ ] Response.error: inclut "early-checkout" (suggestion)
- [ ] PAS de refund traité

### 4.5 Test 5: Modify Reservation

```bash
curl -X POST http://localhost:3000/api/reservations/TEST_RES_005/modify \
  -H "Authorization: Bearer TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "checkIn": "2024-02-01T15:00:00Z",
    "checkOut": "2024-02-10T11:00:00Z",
    "reason": "Extended by 2 days"
  }'
```

Vérifier:
- [ ] Response status: 200
- [ ] Response.reservation.status: 'confirmed' (inchangé)
- [ ] Response.reservation.actionType: 'modification'
- [ ] originalCheckOut sauvegardé
- [ ] Email de modification reçu

### 4.6 Test 6: Raise Dispute

```bash
curl -X POST http://localhost:3000/api/reservations/TEST_RES_006/dispute \
  -H "Authorization: Bearer TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"disputeReason": "Apartment not as described in photos"}'
```

Vérifier:
- [ ] Response status: 200
- [ ] Response.reservation.status: 'dispute'
- [ ] Response.reservation.actionType: 'dispute_resolution'
- [ ] Email d'escalade reçu
- [ ] Message inclut: "Our team will review"

---

## Phase 5: Tests Email

### 5.1 Email de Cancellation

Vérifier que l'email contient:
- [x] Titre: "Annulation Confirmée"
- [x] Montant original
- [x] Pourcentage de remboursement
- [x] Montant remboursé avec couleur verte
- [x] Délai de traitement: "5-7 jours"
- [x] Contact support
- [x] Numéro de réservation

### 5.2 Email de Early Checkout

Vérifier que l'email contient:
- [x] Titre: "Départ Anticipé Confirmé"
- [x] Date d'arrivée vs date de départ réel
- [x] Nombre de jours utilisés
- [x] Remboursement pour jours restants (en %)
- [x] Montant remboursé
- [x] Message: "We hope to see you again soon"

### 5.3 Email de Dispute

Vérifier que l'email contient:
- [x] Titre: "Litige Signalé"
- [x] Raison du litige
- [x] Numéro de dossier (#ID-DISPUTE)
- [x] "Our team will review within 24 hours"
- [x] Étapes: Examen → Contact → Résolution

---

## Phase 6: Performance & Load Testing

### 6.1 Response Time

- [ ] POST /cancel respond in < 500ms
- [ ] POST /early-checkout respond in < 500ms
- [ ] POST /modify respond in < 500ms
- [ ] POST /dispute respond in < 500ms

```bash
ab -n 100 -c 10 -p body.json http://localhost:3000/api/reservations/TEST/cancel
```

### 6.2 Database Queries

- [ ] Vérifier qu'il n'y a qu'1 findOne() call par endpoint
- [ ] Vérifier qu'il n'y a qu'1 save() call par endpoint
- [ ] Pas de N+1 queries

---

## Phase 7: Security & Validation

### 7.1 Authentication

- [ ] Appel sans token → 401 Unauthorized
- [ ] Token invalide → 401 Unauthorized
- [ ] Token d'un autre utilisateur → 403 Forbidden

```bash
# Sans token
curl -X POST http://localhost:3000/api/reservations/TEST/cancel \
  -H "Content-Type: application/json" \
  -d '{"reason": "Test"}'
# Expected: 401

# Token invalide
curl -X POST http://localhost:3000/api/reservations/TEST/cancel \
  -H "Authorization: Bearer INVALID_TOKEN" \
  -d '{"reason": "Test"}'
# Expected: 401
```

### 7.2 Ownership Validation

- [ ] User A ne peut pas canceler réservation de User B
- [ ] Endpoint retourne: "Reservation not found"

### 7.3 Input Validation

- [ ] Raison vide: devrait utiliser valeur par défaut
- [ ] Dates invalides pour modify: 400 Bad Request
- [ ] Check-in ≥ Check-out: 400 Bad Request

---

## Phase 8: Backwards Compatibility

### 8.1 Legacy DELETE Endpoint

```bash
curl -X DELETE http://localhost:3000/api/reservations/TEST/cancel \
  -H "Authorization: Bearer TEST_TOKEN"
```

- [ ] Ancien endpoint fonctionne toujours
- [ ] Redirige vers nouvelle logique
- [ ] Pas de breaking change

### 8.2 Existing Reservations

- [ ] Réservations existantes (sans new fields) fonctionnent
- [ ] Pas d'erreur si actionType est null
- [ ] Optional fields are truly optional in schema

---

## Phase 9: Production Deployment

### 9.1 Pre-Deployment Checklist

- [ ] Tous les tests locaux passing
- [ ] Code reviewed par 1 autre développeur
- [ ] Migration database (si nécessaire)
- [ ] Backup de la base de données
- [ ] Rollback plan préparé

### 9.2 Deployment Steps

```bash
# 1. Stash any uncommitted changes
git stash

# 2. Pull latest changes
git pull origin main

# 3. Install dependencies
npm install

# 4. Run migrations if any
npm run migrate

# 5. Build
npm run build

# 6. Run tests
npm test

# 7. Deploy (using your deployment tool)
# e.g., pm2 restart app, vercel deploy, etc.
```

### 9.3 Post-Deployment Verification

- [ ] API responding with 200 OK
- [ ] Database connection working
- [ ] Emails sending successfully
- [ ] No errors in logs

```bash
# Test endpoints in production
curl https://api.production.com/api/health
curl -X POST https://api.production.com/api/reservations/TEST/cancel \
  -H "Authorization: Bearer PROD_TOKEN" \
  -d '{"reason": "Test"}'
```

### 9.4 Rollback Plan

If issues occur:

```bash
# Rollback to previous version
git revert <commit_hash>
git push origin main

# Or switch back to previous tag
git checkout v1.0.0
npm install
npm run build
# Redeploy
```

---

## Phase 10: Monitoring & Alerts

### 10.1 Metrics to Monitor

```
/cancellations (daily rate)
/early_checkouts (daily rate)
/disputes (daily rate)
/email_failures (error count)
/refund_total (revenue impact)
```

### 10.2 Alerts to Setup

- [ ] SMTP connection failures → alert team
- [ ] More than 10% cancellations per day → alert
- [ ] Email send failure rate > 5% → alert
- [ ] API response time > 1 second → alert
- [ ] Database errors → alert

### 10.3 Logging

Check logs for:
- [ ] Every cancellation is logged
- [ ] Every early checkout is logged
- [ ] Every dispute is logged
- [ ] Every email send is logged
- [ ] Refund amounts are logged

---

## Phase 11: Documentation Update

- [ ] README.md updated with new endpoints
- [ ] API Documentation updated
- [ ] Support team trained on new status types
- [ ] Customer-facing documentation updated (if applicable)
- [ ] Knowledge base articles created

---

## Phase 12: Final Sign-Off

- [ ] Development lead approval: ___________  Date: _______
- [ ] QA lead approval: ___________  Date: _______
- [ ] Product manager approval: ___________  Date: _______
- [ ] Deployment authorized: ___________  Date: _______

---

## Post-Deployment Review (1 Week After)

- [ ] No critical issues reported
- [ ] Performance metrics normal
- [ ] Customer satisfaction maintained
- [ ] Email delivery rate > 98%
- [ ] No database issues
- [ ] Refund processing working correctly

---

**Version:** 1.0
**Created:** 15 Janvier 2024
**Last Updated:** 15 Janvier 2024
**Prepared By:** Development Team
